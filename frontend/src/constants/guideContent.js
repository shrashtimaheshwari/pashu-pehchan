import { Camera, History, BarChart3, HelpCircle } from 'lucide-react';

export const guideContent = {
  en: {
    title: "How to Use Pashu Pehchan",
    subtitle: "Your AI Cattle Identification Assistant",
    sections: [
      {
        id: "scan",
        icon: Camera,
        title: "1. Scan Cattle",
        description: "Click 'New Scan' to upload or capture a photo of the cattle. Ensure the image is clear and the animal's face is visible for accurate AI prediction. Our system will instantly identify the breed and provide a confidence score."
      },
      {
        id: "history",
        icon: History,
        title: "2. View History",
        description: "Access your 'History' tab to see all past scans. You can search by breed, sort by date, download PDF reports of individual scans, or delete records you no longer need."
      },
      {
        id: "analytics",
        icon: BarChart3,
        title: "3. Check Analytics",
        description: "The 'Analytics' dashboard provides visual insights into your scanning activity. View your total scans, average confidence scores, and see the distribution of breeds you've encountered."
      },
      {
        id: "help",
        icon: HelpCircle,
        title: "4. Reporting Issues",
        description: "If an image is blurry, the AI will warn you. For technical issues, you can go to the support section, fill the form, or see FAQs. You can also write a mail to us at support@pashupehchan.gov.in."
      }
    ],
    closeButton: "Got it!"
  },
  hi: {
    title: "पशु पहचान का उपयोग कैसे करें",
    subtitle: "आपका AI पशु पहचान सहायक",
    sections: [
      {
        id: "scan",
        icon: Camera,
        title: "1. नया स्कैन (New Scan)",
        description: "'नया स्कैन' (New Scan) पर क्लिक करके पशु की फोटो अपलोड करें या खींचें। सटीक AI पहचान के लिए सुनिश्चित करें कि फोटो साफ हो और पशु का चेहरा दिखाई दे। हमारा सिस्टम तुरंत नस्ल की पहचान करेगा और कॉन्फिडेंस स्कोर बताएगा।"
      },
      {
        id: "history",
        icon: History,
        title: "2. इतिहास देखें (History)",
        description: "अपने सभी पुराने स्कैन देखने के लिए 'इतिहास' (History) टैब पर जाएं। आप नस्ल के अनुसार खोज सकते हैं, तारीख के अनुसार छाँट सकते हैं, व्यक्तिगत स्कैन की PDF रिपोर्ट डाउनलोड कर सकते हैं, या अनावश्यक रिकॉर्ड हटा सकते हैं।"
      },
      {
        id: "analytics",
        icon: BarChart3,
        title: "3. एनालिटिक्स जांचें (Analytics)",
        description: "'एनालिटिक्स' (Analytics) डैशबोर्ड आपकी स्कैनिंग गतिविधि की दृश्य जानकारी प्रदान करता है। अपने कुल स्कैन, औसत कॉन्फिडेंस स्कोर देखें, और आपके द्वारा पहचानी गई नस्लों का वितरण (distribution) देखें।"
      },
      {
        id: "help",
        icon: HelpCircle,
        title: "4. समस्याओं की रिपोर्ट करें",
        description: "यदि फोटो धुंधली (blurry) है, तो AI आपको चेतावनी देगा। तकनीकी समस्याओं के लिए, आप सपोर्ट सेक्शन में जा सकते हैं, फॉर्म भर सकते हैं या FAQs देख सकते हैं। या फिर आप हमें support@pashupehchan.gov.in पर ईमेल कर सकते हैं।"
      }
    ],
    closeButton: "समझ गया!"
  }
};
