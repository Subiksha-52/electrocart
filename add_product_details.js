const axios = require('axios');

// Product descriptions, features, and specifications by category
const productDetails = {
  "CCTV CAMERAS": {
    description: "High-quality surveillance cameras for security monitoring",
    features: [
      "HD resolution video recording",
      "Night vision capability",
      "Weatherproof design",
      "Motion detection",
      "Remote viewing via mobile app"
    ],
    specifications: {
      "Resolution": "1080p Full HD",
      "Lens": "3.6mm fixed lens",
      "Night Vision": "Up to 30 meters",
      "Weather Rating": "IP66 waterproof",
      "Storage": "Supports up to 128GB SD card",
      "Connectivity": "Wi-Fi & Ethernet"
    }
  },
  "SECURITY ALARM SYSTEM": {
    description: "Comprehensive security alarm systems for home and business protection",
    features: [
      "Wireless sensors",
      "Smartphone notifications",
      "Backup battery",
      "Professional monitoring compatible",
      "Easy installation"
    ],
    specifications: {
      "Sensor Range": "Up to 100 meters",
      "Battery Life": "2 years standby",
      "Alarm Sound": "110dB siren",
      "Connectivity": "GSM & Wi-Fi",
      "Zones": "8 programmable zones",
      "Warranty": "2 years"
    }
  },
  "FIRE ALARM SYSTEM": {
    description: "Reliable fire detection and alarm systems for safety compliance",
    features: [
      "Smoke and heat detection",
      "Audible and visual alarms",
      "Interconnect capability",
      "Battery backup",
      "UL certified"
    ],
    specifications: {
      "Detection Type": "Photoelectric smoke detection",
      "Alarm Volume": "85dB at 3 meters",
      "Operating Temperature": "-10°C to 55°C",
      "Battery": "9V alkaline (included)",
      "Compliance": "UL 217 standards",
      "Dimensions": "130mm diameter"
    }
  },
  "TIME ATTENDANCE SYSTEM": {
    description: "Advanced time and attendance tracking systems for workforce management",
    features: [
      "Biometric fingerprint recognition",
      "Real-time data sync",
      "Multiple shift support",
      "Report generation",
      "Cloud backup"
    ],
    specifications: {
      "User Capacity": "Up to 3000 users",
      "Fingerprint Capacity": "3000 templates",
      "Log Capacity": "100,000 records",
      "Display": "2.4-inch TFT screen",
      "Connectivity": "USB, Ethernet, Wi-Fi",
      "Software": "Windows compatible"
    }
  },
  "ACCESS CONTROL SYSTEM": {
    description: "Secure access control solutions for restricted area protection",
    features: [
      "RFID card access",
      "PIN code support",
      "Door status monitoring",
      "Anti-passback feature",
      "Access scheduling"
    ],
    specifications: {
      "User Capacity": "Up to 10,000 users",
      "Event Log": "100,000 records",
      "Reader Type": "125kHz RFID",
      "Lock Support": "Electric strike, magnetic lock",
      "Power": "12V DC, 500mA",
      "Communication": "RS485, TCP/IP"
    }
  },
  "VIDEO DOOR PHONE SYSTEM": {
    description: "Modern video intercom systems for enhanced door security",
    features: [
      "HD video calling",
      "Two-way audio",
      "Night vision",
      "Mobile app integration",
      "Unlock remotely"
    ],
    specifications: {
      "Camera Resolution": "720p HD",
      "Display Size": "7-inch LCD",
      "Night Vision": "IR LEDs up to 5m",
      "Video Call": "Free unlimited calls",
      "Storage": "Cloud recording available",
      "Power": "12V DC adapter"
    }
  },
  "HOME THEATRE": {
    description: "Immersive home entertainment systems for cinematic experience",
    features: [
      "Dolby Atmos support",
      "Wireless subwoofer",
      "Bluetooth connectivity",
      "4K pass-through",
      "Voice control compatible"
    ],
    specifications: {
      "Channels": "5.1 surround sound",
      "Total Power": "500W RMS",
      "Connectivity": "HDMI, Optical, Bluetooth",
      "Sound Modes": "Movie, Music, Sports",
      "Dimensions": "Soundbar: 90cm, Sub: 30cm",
      "Warranty": "1 year"
    }
  },
  "CABLES": {
    description: "High-quality cables for reliable signal transmission",
    features: [
      "Oxygen-free copper conductors",
      "Double shielding",
      "Gold-plated connectors",
      "UV resistant jacket",
      "Flexible design"
    ],
    specifications: {
      "Conductor": "99.99% oxygen-free copper",
      "Impedance": "75 ohms",
      "Shielding": "Double braided shield",
      "Jacket": "UV resistant PVC",
      "Connectors": "Gold-plated RCA",
      "Length": "Various lengths available"
    }
  },
  "ACCESSORIES": {
    description: "Essential accessories for complete system installation",
    features: [
      "Universal compatibility",
      "Easy installation",
      "Durable construction",
      "Weather resistant",
      "Professional grade"
    ],
    specifications: {
      "Material": "High-grade steel/aluminum",
      "Finish": "Powder coated",
      "Weight Capacity": "Up to 20kg",
      "Weather Rating": "IP65 outdoor rated",
      "Compatibility": "Universal fit",
      "Installation": "Tool-free setup"
    }
  }
};

// Base URL for API
const BASE_URL = 'http://localhost:5000/api';

async function updateProductDetails() {
  try {
    // Get all products
    const response = await axios.get(`${BASE_URL}/products`);
    const products = response.data;

    console.log(`Found ${products.length} products to update`);

    for (const product of products) {
      const categoryDetails = productDetails[product.category];
      
      if (categoryDetails) {
        const updateData = {
          description: categoryDetails.description,
          features: categoryDetails.features,
          specifications: categoryDetails.specifications,
          qty: product.qty || product.stock || 0,
          price: product.price
        };

        console.log(`Updating ${product.name} (${product.category})...`);
        
        try {
          const updateResponse = await axios.put(`${BASE_URL}/products/${product._id}`, updateData);
          console.log(`✅ Updated: ${product.name}`);
        } catch (error) {
          console.log(`❌ Failed to update ${product.name}:`, error.response?.data || error.message);
        }
        
        // Add a small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        console.log(`⚠️ No details found for category: ${product.category}`);
      }
    }

    console.log('Product details update completed!');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Run the update
updateProductDetails();
