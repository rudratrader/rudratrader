import fs from "fs";
import axios from "axios";
import csv from "csv-parser";
import sharp from "sharp"
import { exit } from "process";

const PRODUCT_API = "http://localhost:5000/api/products/create";
const BRAND_API = "http://localhost:5000/api/brands/get";
const CATEGORY_API = "http://localhost:5000/api/categories/get";

// Read CSV and return array of rows
function readCSV(filepath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

// Convert image URL to WebP Blob
async function convertImageToWebP(url, fileName = "image") {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const webpBuffer = await sharp(response.data)
      .webp({ quality: 80 }) // Adjust quality as needed
      .toBuffer();

    // Create a Blob with proper MIME type
    const blob = new Blob([webpBuffer], { type: 'image/webp' });
    
    // Generate filename (remove extension and add webp)
    const baseFileName = fileName.replace(/\.[^/.]+$/, "");
    const webpFileName = `${baseFileName}_${Date.now()}.webp`;

    return {
      blob: blob,
      fileName: webpFileName
    };
  } catch (error) {
    console.error("Failed to download/convert image:", url, error.message);
    return null;
  }
}

async function main() {
  // Load CSVs
  const productsCSV = await readCSV("Products.csv");
  const brandsCSV = await readCSV("Brands.csv");
  const categoriesCSV = await readCSV("Categories.csv");

  // Get brand/category data from DB
  const brandResponse = await axios.get(BRAND_API);
  const categoryResponse = await axios.get(CATEGORY_API);

  const dbBrands = brandResponse.data.records; // assume [{_id, brandName}, ...]
  const dbCategories = categoryResponse.data.records; // assume [{_id, name}, ...]

  // Create mapping: csvID → brandName / categoryName
  const csvBrandIdToName = {};
  brandsCSV.forEach((b) => {
    csvBrandIdToName[b.id] = b.brandName.trim();
  });

  const csvCategoryIdToName = {};
  categoriesCSV.forEach((c) => {
    csvCategoryIdToName[c.id] = c.name.trim();
  });

  // Create name → _id map from DB
  const dbBrandNameToId = {};
  dbBrands.forEach((b) => {
    dbBrandNameToId[b.brandName.trim()] = b._id;
  });

  const dbCategoryNameToId = {};
  dbCategories.forEach((c) => {
    dbCategoryNameToId[c.categoryName.trim()] = c._id;
  });

  for (const row of productsCSV) {
    try {
      const csvBrandName = csvBrandIdToName[row.brandId?.trim()];
      const csvCategoryName = csvCategoryIdToName[row.categoryId?.trim()];

      const brandId = dbBrandNameToId[csvBrandName];
      const categoryId = dbCategoryNameToId[csvCategoryName];

      if (!brandId || !categoryId) {
        console.warn(`❌ Skipping product "${row.name}" due to missing brand/category`);
        continue;
      }

      // Create FormData
      const formData = new FormData();
      
      // Add product data
      formData.append('name', row.name);
      formData.append('price', parseFloat(row.price));
      formData.append('brandId', brandId);
      formData.append('categoryId', categoryId);
      formData.append('quantity', row.quantity || 0);
      formData.append('description', row.description || "");
      formData.append('status', row.status?.trim().toLowerCase() === "a" ? "active" : "inactive");

      // Process and add images as blobs
      const imageUrls = JSON.parse(row.image);
      for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        console.log(`Processing image ${i + 1}:`, url);
        
        const imageResult = await convertImageToWebP(url, `image_${i + 1}`);
        if (imageResult) {
          console.log(`Converted image:`, {
            blob: imageResult.blob,
            fileName: imageResult.fileName
          });
          
          // Append the blob with the filename
          formData.append('images', imageResult.blob, imageResult.fileName);
        }
      }

      // Send the request
      await axios.post(PRODUCT_API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log(`✅ Uploaded product: ${row.name}`);
    } catch (err) {
      console.error(`❌ Error uploading product: ${row.name}`, err.response?.data || err.message);
    }
  }
}

main().catch(console.error);