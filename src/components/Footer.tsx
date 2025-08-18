import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#D9A299] shadow-inner mt-auto py-6 text-gray-700 w-full">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex justify-between items-start gap-8 min-h-[120px]">
            {/* Left: About Us */}
            <div className="flex-1 max-w-md">
              <h3 className="text-lg font-semibold text-[#FAF7F3] mb-2">About Us</h3>
              <div className="text-[#FAF7F3] text-sm leading-relaxed mb-3">
                <p>We are dedicated to bringing you the finest quality agarbatti, dhoop, and fragrance products from trusted brands. With a deep respect for tradition and a passion for purity, we aim to spread soothing aromas that create moments of peace and positivity in every home.</p>
              </div>
              <div className="text-sm text-[#FAF7F3]">
                <div className="flex gap-1 ">
                  <span>&copy; {new Date().getFullYear()}</span>
                  <span className="font-medium">RudraTrader.shop</span>
                  <span>- All rights reserved.</span>
                </div>
              </div>
            </div>

            {/* Right: Contact */}
            <div className="flex-1 max-w-md">
              <h3 className="text-lg font-semibold text-[#FAF7F3] mb-3">Contact Us</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 text-[#FAF7F3]">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#FAF7F3]" />
                  <div>
                    <a 
                      href="https://maps.app.goo.gl/uBYT6Ljtz2EyNMSz5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-200"
                    >
                      <p className="leading-relaxed">11-3-934/1/1, 1st Floor, New Mallepally,</p>
                      <p className="leading-relaxed">Opp Priya Theater, Hyderabad, Telangana - 500001</p>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#FAF7F3]">
                  <Phone className="w-4 h-4 flex-shrink-0 text-[#FAF7F3]" />
                  <a 
                    href="tel:+919885156895" 
                    className="hover:text-white transition-colors duration-200"
                  >
                    +91 9885156895
                  </a>
                </div>

                <div className="flex items-center gap-3 text-[#FAF7F3]">
                  <Mail className="w-4 h-4 flex-shrink-0 text-[#FAF7F3]" />
                  <a
                    href="mailto:contact@rudratrader.shop"
                    className="hover:text-white transition-colors duration-200 break-words"
                  >
                    contact@rudratrader.shop
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden sm:block md:hidden">
          <div className="text-left mb-6">
            <h3 className="text-lg font-semibold text-[#FAF7F3] mb-4">About Us</h3>
            <div className="text-[#FAF7F3] text-sm leading-relaxed mb-6">
              <p>We are dedicated to bringing you the finest quality agarbatti, dhoop, and fragrance products from trusted brands. With a deep respect for tradition and a passion for purity, we aim to spread soothing aromas that create moments of peace and positivity in every home.</p>
            </div>
            
            <h3 className="text-lg font-semibold text-[#FAF7F3] mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FAF7F3] mt-0.5 flex-shrink-0" />
                <div className="text-[#FAF7F3]">
                  <a 
                    href="https://maps.app.goo.gl/uBYT6Ljtz2EyNMSz5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-200"
                  >
                    <p className="leading-relaxed">11-3-934/1/1, 1st Floor, New Mallepally,</p>
                    <p className="leading-relaxed">Opp Priya Theater, Hyderabad, Telangana - 500001</p>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#FAF7F3]">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a 
                  href="tel:+919885156895" 
                  className="hover:text-white transition-colors duration-200"
                >
                  +91 9885156895
                </a>
              </div>

              <div className="flex items-center gap-3 text-[#FAF7F3]">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:contact@rudratrader.shop"
                  className="hover:text-white transition-colors duration-200 break-words"
                >
                  contact@rudratrader.shop
                </a>
              </div>
            </div>
          </div>

          <div className="text-left text-sm text-[#FAF7F3]">
            <div className="flex flex-wrap items-center gap-1">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="font-medium">RudraTrader.shop</span>
              <span>- All rights reserved.</span>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#FAF7F3] mb-3 text-left">About Us</h3>
            <div className="text-[#FAF7F3] text-sm leading-relaxed mb-6">
              <p>We are dedicated to bringing you the finest quality agarbatti, dhoop, and fragrance products from trusted brands. With a deep respect for tradition and a passion for purity, we aim to spread soothing aromas that create moments of peace and positivity in every home.</p>
            </div>

            <h3 className="text-lg font-semibold text-[#FAF7F3] mb-3 text-left">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-[#FAF7F3]">
                <MapPin className="w-4 h-4 text-[#FAF7F3] mt-0.5 flex-shrink-0" />
                <div>
                  <a 
                    href="https://maps.app.goo.gl/uBYT6Ljtz2EyNMSz5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-200"
                  >
                    <p className="leading-relaxed">11-3-934/1/1, 1st Floor, New Mallepally,</p>
                    <p className="leading-relaxed">Opp Priya Theater, Hyderabad, Telangana - 500001</p>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#FAF7F3]">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a 
                  href="tel:+919885156895" 
                  className="hover:text-white transition-colors duration-200"
                >
                  +91 9885156895
                </a>
              </div>

              <div className="flex items-start gap-3 text-[#FAF7F3]">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:contact@rudratrader.shop"
                  className="hover:text-white transition-colors duration-200 break-words leading-relaxed"
                >
                  contact@rudratrader.shop
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-left text-sm text-[#FAF7F3]">
            <div className="flex items-center gap-1 flex-wrap">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="font-medium">RudraTrader.shop</span>
              <span>- All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;