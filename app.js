const state = {
  apiKey: localStorage.getItem("krishi_gemini_api_key") || "",
  currentLanguage: "en",
  selectedImageBase64: null,
  selectedImageMimeType: null,
  selectedRegion: "bhopal",
  chatHistory: [],
  speechSynthesisActive: false,
  recognitionActive: false,
  recognition: null,
  currentDiagnosisText: "",
};

const weatherDatabase = {
  bhopal: {
    temp: "34°C",
    humidity: "65%",
    condition: "Cloudy",
    conditionId: "cloudy",
  },
  indore: {
    temp: "35°C",
    humidity: "55%",
    condition: "Sunny",
    conditionId: "sunny",
  },
  jabalpur: {
    temp: "33°C",
    humidity: "70%",
    condition: "Heavy Rain",
    conditionId: "rain",
  },
};

const TRANSLATIONS = {
  en: {
    appTitle: "Krishi-AI",
    appBadge: "Annam.AI Project Initiative",
    diagnosticsHeading: "Crop Health Scanner",
    diagnosticsSub: "Upload leaf photo for instant biological diagnosis",
    uploadMain:
      'Drag & drop plant image or <span class="highlight">browse</span>',
    uploadSub: "Supports JPG, PNG, WEBP up to 5MB",
    analyzeBtn: "Scan Crop Health",
    analyzeBtnLoading: "Analyzing Plant Cells...",
    resultTitle: "Diagnostic Assessment",
    organicTitle: "Organic Remedies",
    chemicalTitle: "Chemical Control",
    preventativeTitle: "Preventative Actions",
    advisoryHeading: "Smart Weather Advisory",
    advisorySub: "Bhopal Region, Madhya Pradesh",
    tempLabel: "Temperature",
    humidityLabel: "Humidity",
    conditionLabel: "Condition",
    advisorTipTitle: "Crop Advisory",
    chatHeading: "Ask Yaksha (Agri-Expert)",
    chatSub: "Conversational AI assistant for MP Agriculture",
    chatWelcome:
      "Welcome to Krishi-AI. I can assist you with MP soil preparation, soybean/wheat crop cycles, and organic pest control in Hindi, Punjabi, or English. How can I support you today?",
    settingsTitle: "API Configuration",
    settingsInstruction:
      "Please provide your Google Gemini API Key to enable diagnostic scanning and conversational chat services. The key is stored locally in your browser cache.",
    apiKeyLabel: "Gemini API Key",
    saveSettingsBtn: "Save Settings",
    toastKeySaved: "API Key saved successfully!",
    toastKeyMissing: "Please configure your Gemini API Key in Settings first.",
    toastNoImage: "Please upload a crop image to analyze.",
    toastScanSuccess: "Diagnosis completed successfully!",
    toastScanFailed:
      "Failed to analyze image. Please check your API key and connection.",
    toastSpeakStart: "Reading diagnosis aloud...",
    toastSpeakStop: "Voice stopped.",
    toastSpeechNotSupported: "Speech synthesis not supported in this browser.",
    toastSpeechInputNotSupported:
      "Speech recognition not supported in this browser.",
    toastListening: "Listening... Speak now.",
    toastListeningStopped: "Stopped listening.",
    toastImageReady: "Image selected successfully.",
    toastImageRemoved: "Image removed.",
    toastNoDiagnosis: "Please scan an image first to hear the diagnosis.",
    chatPlaceholder: "Ask about soil, crops, seeds...",
    speakBtnText: "Listen",
    severityLabel: "Severity:",
    healthStatusBadge: "Issue Identified",
    issueNamePlaceholder: "Leaf Spot",
    cropNamePlaceholder: "Crop: N/A",
    defaultAdvisories: {
      bhopal:
        "Delayed monsoon advisory. Sowing of soybean and maize crops should be deferred until 50-60mm of cumulative rainfall is received to prevent germination failure.",
      indore:
        "Dry conditions in Malwa. Prepare land for soybean and pulse sowing. Apply organic compost and monitor soil moisture levels closely.",
      jabalpur:
        "Heavy pre-monsoon shower alert. Ensure proper drainage in paddy nurseries. Avoid pesticide application before dry spells return.",
    },
  },
  hi: {
    appTitle: "कृषि-AI",
    appBadge: "अन्नम.AI परियोजना पहल",
    diagnosticsHeading: "फसल स्वास्थ्य स्कैनर",
    diagnosticsSub: "त्वरित जैविक निदान के लिए पत्ते की फोटो अपलोड करें",
    uploadMain:
      'पत्ती की तस्वीर खींचकर यहाँ डालें या <span class="highlight">फ़ाइल चुनें</span>',
    uploadSub: "5MB तक JPG, PNG, WEBP का समर्थन करता है",
    analyzeBtn: "फसल स्वास्थ्य की जांच करें",
    analyzeBtnLoading: "पौधे की कोशिकाओं का विश्लेषण हो रहा है...",
    resultTitle: "नैदानिक मूल्यांकन",
    organicTitle: "जैविक उपचार",
    chemicalTitle: "रासायनिक नियंत्रण",
    preventativeTitle: "निवारक उपाय",
    advisoryHeading: "स्मार्ट मौसम सलाह",
    advisorySub: "भोपाल क्षेत्र, मध्य प्रदेश",
    tempLabel: "तापमान",
    humidityLabel: "आर्द्रता",
    conditionLabel: "स्थिति",
    advisorTipTitle: "फसल सलाह",
    chatHeading: "यक्ष से पूछें (कृषि विशेषज्ञ)",
    chatSub: "मध्य प्रदेश कृषि के लिए संवादात्मक एआई सहायक",
    chatWelcome:
      "कृषि-AI में आपका स्वागत है। मैं हिंदी, पंजाबी या अंग्रेजी में मध्य प्रदेश की मिट्टी की तैयारी, सोयाबीन/गेहूं चक्र और जैविक कीट नियंत्रण में आपकी सहायता कर सकता हूँ। आज मैं आपकी क्या मदद करूँ?",
    settingsTitle: "एपीआई कॉन्फ़िगरेशन",
    settingsInstruction:
      "डायलॉग स्कैनिंग और चैट सेवाओं को सक्षम करने के लिए कृपया अपनी Google Gemini API कुंजी दर्ज करें। कुंजी आपके ब्राउज़र कैश में सुरक्षित रहती है।",
    apiKeyLabel: "जेमिनी एपीआई कुंजी",
    saveSettingsBtn: "सेटिंग्स सुरक्षित करें",
    toastKeySaved: "एपीआई कुंजी सफलतापूर्वक सहेज ली गई है!",
    toastKeyMissing: "कृपया पहले सेटिंग्स में जेमिनी एपीआई कुंजी को दर्ज करें।",
    toastNoImage: "कृपया विश्लेषण के लिए एक फसल की छवि अपलोड करें।",
    toastScanSuccess: "रोग निदान सफलतापूर्वक पूरा हुआ!",
    toastScanFailed:
      "छवि का विश्लेषण करने में विफल। कृपया अपनी एपीआई कुंजी और इंटरनेट की जांच करें।",
    toastSpeakStart: "परिणाम पढ़कर सुनाया जा रहा है...",
    toastSpeakStop: "आवाज बंद कर दी गई है।",
    toastSpeechNotSupported: "इस ब्राउज़र में स्पीच सिंथेसिस समर्थित नहीं है।",
    toastSpeechInputNotSupported:
      "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है।",
    toastListening: "सुन रहा हूँ... बोलिए।",
    toastListeningStopped: "सुनना बंद कर दिया गया।",
    toastImageReady: "छवि सफलतापूर्वक चुनी गई।",
    toastImageRemoved: "छवि हटाई गई।",
    toastNoDiagnosis: "निदान सुनने के लिए पहले फसल की छवि स्कैन करें।",
    chatPlaceholder: "मिट्टी, फसल, बीज के बारे में पूछें...",
    speakBtnText: "सुनें",
    severityLabel: "तीव्रता:",
    healthStatusBadge: "रोग की पहचान हुई",
    issueNamePlaceholder: "पत्ती का धब्बा",
    cropNamePlaceholder: "फसल: उपलब्ध नहीं",
    defaultAdvisories: {
      bhopal:
        "मानसून में देरी की चेतावनी। सोयाबीन और मक्का की बुवाई तब तक टालें जब तक कि 50-60 मिमी संचयी वर्षा न हो जाए, ताकि अंकुरण विफलता से बचा जा सके।",
      indore:
        "मालवा में शुष्क मौसम। सोयाबीन और दालों की बुवाई के लिए भूमि तैयार करें। जैविक खाद डालें और मिट्टी की नमी पर नजर रखें।",
      jabalpur:
        "भारी वर्षा की चेतावनी। धान की नर्सरियों में उचित जल निकासी सुनिश्चित करें। सूखे दौर की वापसी से पहले कीटनाशकों के छिड़काव से बचें।",
    },
  },
  pa: {
    appTitle: "ਕ੍ਰਿਸ਼ੀ-AI",
    appBadge: "ਅੰਨਮ.AI ਪ੍ਰੋਜੈਕਟ ਪਹਿਲ",
    diagnosticsHeading: "ਫ਼ਸਲ ਸਿਹਤ ਸਕੈਨਰ",
    diagnosticsSub: "ਤੁਰੰਤ ਜੈਵਿਕ ਨਿਦਾਨ ਲਈ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",
    uploadMain:
      'ਫ਼ਸਲ ਦੀ ਫੋਟੋ ਇੱਥੇ ਖਿੱਚੋ ਜਾਂ <span class="highlight">ਲੱਭੋ</span>',
    uploadSub: "5MB ਤੱਕ JPG, PNG, WEBP ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ",
    analyzeBtn: "ਫ਼ਸਲ ਦੀ ਸਿਹਤ ਦੀ ਜਾਂਚ ਕਰੋ",
    analyzeBtnLoading: "ਪੌਦੇ ਦੇ ਸੈੱਲਾਂ ਦੀ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    resultTitle: "ਨਿਦਾਨ ਮੁਲਾਂਕਣ",
    organicTitle: "ਜੈਵਿਕ ਉਪਚਾਰ",
    chemicalTitle: "ਰਸਾਇਣਕ ਰੋਕਥਾਮ",
    preventativeTitle: "ਬਚਾਅ ਦੇ ਉਪਾਅ",
    advisoryHeading: "ਸਮਾਰਟ ਮੌਸਮ ਸਲਾਹ",
    advisorySub: "ਭੋਪਾਲ ਖੇਤਰ, ਮੱਧ ਪ੍ਰਦੇਸ਼",
    tempLabel: "ਤਾਪਮਾਨ",
    humidityLabel: "ਨਮੀ",
    conditionLabel: "ਹਾਲਤ",
    advisorTipTitle: "ਫ਼ਸਲ ਸਲਾਹ",
    chatHeading: "ਯਕਸ਼ ਨੂੰ ਪੁੱਛੋ (ਖੇਤੀਬਾੜੀ ਮਾਹਿਰ)",
    chatSub: "ਮੱਧ ਪ੍ਰਦੇਸ਼ ਖੇਤੀਬਾੜੀ ਲਈ ਗੱਲਬਾਤ ਕਰਨ ਵਾਲਾ ਏਆਈ ਸਹਾਇਕ",
    chatWelcome:
      "ਕ੍ਰਿਸ਼ੀ-AI ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਮੈਂ ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਮੱਧ ਪ੍ਰਦੇਸ਼ ਦੀ ਮਿੱਟੀ ਤਿਆਰ ਕਰਨ, ਸੋਇਆਬੀਨ/ਕਣਕ ਦੇ ਚੱਕਰ ਅਤੇ ਜੈਵਿਕ ਰੋਕਥਾਮ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰਾਂ?",
    settingsTitle: "API ਸੰਰਚਨਾ",
    settingsInstruction:
      "ਨਿਦਾਨ ਸਕੈਨਿੰਗ ਅਤੇ ਚੈਟ ਸੇਵਾਵਾਂ ਨੂੰ ਚਾਲੂ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ Google Gemini API ਕੁੰਜੀ ਦਰਜ ਕਰੋ। ਇਹ ਕੁੰਜੀ ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਕੈਸ਼ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰਹੇਗੀ।",
    apiKeyLabel: "Gemini API ਕੁੰਜੀ",
    saveSettingsBtn: "ਸੈਟਿੰਗਾਂ ਸੁਰੱਖਿਅਤ ਕਰੋ",
    toastKeySaved: "API ਕੁੰਜੀ ਸਫਲਤਾਪੂਰਵਕ ਸੁਰੱਖਿਅਤ ਕੀਤੀ ਗਈ!",
    toastKeyMissing:
      "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਸੈਟਿੰਗਾਂ ਵਿੱਚ Gemini API ਕੁੰਜੀ ਦਰਜ ਕਰੋ।",
    toastNoImage: "ਕਿਰਪਾ ਕਰਕੇ ਜਾਂਚ ਲਈ ਇੱਕ ਫ਼ਸਲ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।",
    toastScanSuccess: "ਬਿਮਾਰੀ ਦਾ ਨਿਦਾਨ ਸਫਲਤਾਪੂਰਵਕ ਪੂਰਾ ਹੋਇਆ!",
    toastScanFailed:
      "ਫੋਟੋ ਦੀ ਜਾਂਚ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ API ਕੁੰਜੀ ਅਤੇ ਇੰਟਰਨੈਟ ਦੀ ਜਾਂਚ ਕਰੋ।",
    toastSpeakStart: "ਨਤੀਜਾ ਪੜ੍ਹ ਕੇ ਸੁਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...",
    toastSpeakStop: "ਆਵਾਜ਼ ਬੰਦ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ।",
    toastSpeechNotSupported: "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸਪੀਚ ਸਿੰਥੇਸਿਸ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।",
    toastSpeechInputNotSupported:
      "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸਪੀਚ ਰਿਕੋਗਨੀਸ਼ਨ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।",
    toastListening: "ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ ਜੀ।",
    toastListeningStopped: "ਸੁਣਨਾ ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ।",
    toastImageReady: "ਫੋਟੋ ਸਫਲਤਾਪੂਰਵਕ ਚੁਣੀ ਗਈ।",
    toastImageRemoved: "ਫੋਟੋ ਹਟਾਈ ਗਈ।",
    toastNoDiagnosis: "ਨਿਦਾਨ ਸੁਣਨ ਲਈ ਪਹਿਲਾਂ ਫ਼ਸਲ ਦੀ ਫੋਟੋ ਸਕੈਨ ਕਰੋ।",
    chatPlaceholder: "ਮਿੱਟੀ, ਫ਼ਸਲ, ਬੀਜ ਬਾਰੇ ਪੁੱਛੋ...",
    speakBtnText: "ਸੁਣੋ",
    severityLabel: "ਤੀਬਰਤਾ:",
    healthStatusBadge: "ਬਿਮਾਰੀ ਲੱਭੀ ਗਈ",
    issueNamePlaceholder: "ਪੱਤੇ ਦਾ ਧੱਬਾ",
    cropNamePlaceholder: "ਫ਼ਸਲ: ਉਪਲਬਧ ਨਹੀਂ",
    defaultAdvisories: {
      bhopal:
        "ਮਾਨਸੂਨ ਵਿੱਚ ਦੇਰੀ ਦੀ ਚੇਤਾਵਨੀ। ਸੋਇਆਬੀਨ ਅਤੇ ਮੱਕੀ ਦੀ ਬਿਜਾਈ ਉਦੋਂ ਤੱਕ ਮੁਲਤਵੀ ਕਰੋ ਜਦੋਂ ਤੱਕ 50-60 ਮਿਲੀਮੀਟਰ ਮੀਂਹ ਨਾ ਪੈ ਜਾਵੇ, ਤਾਂ ਜੋ ਬੀਜ ਖ਼ਰਾਬ ਹੋਣ ਤੋਂ ਬਚਿਆ ਜਾ ਸਕੇ।",
      indore:
        "ਮਾਲਵਾ ਵਿੱਚ ਖੁਸ਼ਕ ਹਾਲਤਾਂ। ਸੋਇਆਬੀਨ ਅਤੇ ਦਾਲਾਂ ਦੀ ਬਿਜਾਈ ਲਈ ਜ਼ਮੀਨ ਤਿਆਰ ਕਰੋ। ਜੈਵਿਕ ਖਾਦ ਪਾਓ ਅਤੇ ਨਮੀ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।",
      jabalpur:
        "ਭਾਰੀ ਮੀਂਹ ਦਾ ਅਲਰਟ। ਝੋਨੇ ਦੀਆਂ ਨਰਸਰੀਆਂ ਵਿੱਚ ਪਾਣੀ ਦੇ ਨਿਕਾਸ ਦਾ ਉਚਿਤ ਪ੍ਰਬੰਧ ਕਰੋ। ਸੁੱਕੇ ਮੌਸਮ ਤੋਂ ਪਹਿਲਾਂ ਕੀਟਨਾਸ਼ਕਾਂ ਦੇ ਛਿੜਕਾਅ ਤੋਂ ਬਚੋ।",
    },
  },
};

const elements = {
  langBtns: document.querySelectorAll(".lang-btn"),
  openSettingsBtn: document.getElementById("open-settings-btn"),
  closeSettingsBtn: document.getElementById("close-settings-btn"),
  saveSettingsBtn: document.getElementById("save-settings-btn"),
  settingsModal: document.getElementById("settings-modal"),
  apiKeyInput: document.getElementById("api-key-input"),
  keyStatus: document.getElementById("key-status"),

  dropZone: document.getElementById("drop-zone"),
  fileInput: document.getElementById("file-input"),
  previewContainer: document.getElementById("preview-container"),
  uploadPreview: document.getElementById("upload-preview"),
  removeImgBtn: document.getElementById("remove-img-btn"),
  analyzeBtn: document.getElementById("analyze-btn"),
  analyzeBtnText: document.getElementById("analyze-btn-text"),
  btnLoader: document.getElementById("btn-loader"),

  resultsContainer: document.getElementById("results-container"),
  readAloudBtn: document.getElementById("read-aloud-btn"),
  speakBtnText: document.getElementById("speak-btn-text"),
  resultCropName: document.getElementById("result-crop-name"),
  resultIssueName: document.getElementById("result-issue-name"),
  resultSeverity: document.getElementById("result-severity"),
  resultOrganic: document.getElementById("result-organic"),
  resultChemical: document.getElementById("result-chemical"),
  resultPreventative: document.getElementById("result-preventative"),

  regionSelector: document.getElementById("region-selector"),
  weatherTemp: document.getElementById("weather-temp"),
  weatherHumidity: document.getElementById("weather-humidity"),
  weatherCondition: document.getElementById("weather-condition"),
  weatherAdvisoryText: document.getElementById("weather-advisory-text"),

  chatBox: document.getElementById("chat-box"),
  chatInputForm: document.getElementById("chat-input-form"),
  chatInput: document.getElementById("chat-input"),
  sendBtn: document.getElementById("send-btn"),
  voiceInputBtn: document.getElementById("voice-input-btn"),
  toast: document.getElementById("toast"),

  appTitle: document.getElementById("app-title"),
  appBadge: document.getElementById("app-badge"),
  diagnosticsHeading: document.getElementById("diagnostics-heading"),
  diagnosticsSub: document.getElementById("diagnostics-sub"),
  uploadMainText: document.getElementById("upload-main-text"),
  uploadSubText: document.getElementById("upload-sub-text"),
  resultTitle: document.getElementById("result-title"),
  organicRemediesTitle: document.getElementById("organic-remedies-title"),
  chemicalRemediesTitle: document.getElementById("chemical-remedies-title"),
  preventativeMeasuresTitle: document.getElementById(
    "preventative-measures-title",
  ),
  advisoryHeading: document.getElementById("advisory-heading"),
  advisorySub: document.getElementById("advisory-sub"),
  weatherTempLabel: document.getElementById("weather-temp-label"),
  weatherHumidityLabel: document.getElementById("weather-humidity-label"),
  weatherConditionLabel: document.getElementById("weather-condition-label"),
  advisorTipTitle: document.getElementById("advisor-tip-title"),
  chatHeading: document.getElementById("chat-heading"),
  chatSub: document.getElementById("chat-sub"),
  chatWelcomeMsg: document.getElementById("chat-welcome-msg"),
  settingsModalTitle: document.getElementById("settings-modal-title"),
  settingsInstruction: document.getElementById("settings-instruction"),
  apiKeyLabel: document.getElementById("api-key-label"),
  severityLabel: document.getElementById("severity-label"),
  healthStatusBadge: document.getElementById("health-status-badge"),
};

function init() {
  updateKeyStatusDisplay();

  updateUIStrings(state.currentLanguage);

  updateWeatherAdvisory(state.selectedRegion);

  [
    elements.openSettingsBtn,
    elements.closeSettingsBtn,
    elements.saveSettingsBtn,
    elements.removeImgBtn,
    elements.analyzeBtn,
    elements.readAloudBtn,
    elements.voiceInputBtn,
    elements.sendBtn,
    ...Array.from(elements.langBtns),
  ].forEach(addInteractiveButtonFeedback);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    state.recognition = new SpeechRecognition();
    state.recognition.continuous = false;
    state.recognition.interimResults = false;

    state.recognition.onstart = () => {
      state.recognitionActive = true;
      elements.voiceInputBtn.classList.add("listening");
      showToast(TRANSLATIONS[state.currentLanguage].toastListening);
    };

    state.recognition.onend = () => {
      state.recognitionActive = false;
      elements.voiceInputBtn.classList.remove("listening");
    };

    state.recognition.onerror = (e) => {
      console.error("Speech Recognition Error", e);
      state.recognitionActive = false;
      elements.voiceInputBtn.classList.remove("listening");
    };

    state.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      elements.chatInput.value = transcript;
      showToast(TRANSLATIONS[state.currentLanguage].toastListeningStopped);

      handleChatSubmit();
    };
  }

  registerEventListeners();
}

function addInteractiveButtonFeedback(button) {
  if (!button) return;

  button.addEventListener("pointerdown", () => button.classList.add("pressed"));
  button.addEventListener("pointerup", () =>
    button.classList.remove("pressed"),
  );
  button.addEventListener("pointerleave", () =>
    button.classList.remove("pressed"),
  );
  button.addEventListener("pointercancel", () =>
    button.classList.remove("pressed"),
  );
}

function registerEventListeners() {
  elements.openSettingsBtn.addEventListener("click", openSettings);
  elements.closeSettingsBtn.addEventListener("click", closeSettings);
  elements.saveSettingsBtn.addEventListener("click", saveSettings);
  elements.settingsModal.addEventListener("click", (e) => {
    if (e.target === elements.settingsModal) closeSettings();
  });

  elements.langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedLang = btn.getAttribute("data-lang");
      changeLanguage(selectedLang);
    });
  });

  elements.dropZone.addEventListener("click", () => elements.fileInput.click());
  elements.fileInput.addEventListener("change", handleFileSelect);

  elements.dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    elements.dropZone.classList.add("dragover");
  });

  elements.dropZone.addEventListener("dragleave", () => {
    elements.dropZone.classList.remove("dragover");
  });

  elements.dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    elements.dropZone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  });

  elements.removeImgBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearImageUpload();
  });

  elements.analyzeBtn.addEventListener("click", runCropDiagnosis);
  elements.readAloudBtn.addEventListener("click", toggleDiagnosisSpeech);

  elements.regionSelector.addEventListener("change", (e) => {
    state.selectedRegion = e.target.value;
    updateWeatherAdvisory(state.selectedRegion);
  });

  elements.chatInputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleChatSubmit();
  });

  elements.sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    elements.chatInputForm.requestSubmit();
  });

  elements.voiceInputBtn.addEventListener("click", toggleVoiceInput);
}

function changeLanguage(lang) {
  if (state.currentLanguage === lang) return;
  state.currentLanguage = lang;

  elements.langBtns.forEach((btn) => {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  updateUIStrings(lang);
  updateWeatherAdvisory(state.selectedRegion);

  if (state.speechSynthesisActive) {
    window.speechSynthesis.cancel();
    state.speechSynthesisActive = false;
    elements.readAloudBtn.classList.remove("speaking");
    elements.speakBtnText.textContent =
      TRANSLATIONS[state.currentLanguage].speakBtnText;
  }
}

function updateUIStrings(lang) {
  const dict = TRANSLATIONS[lang];

  elements.appTitle.textContent = dict.appTitle;
  elements.appBadge.textContent = dict.appBadge;
  elements.diagnosticsHeading.textContent = dict.diagnosticsHeading;
  elements.diagnosticsSub.textContent = dict.diagnosticsSub;
  elements.uploadMainText.innerHTML = dict.uploadMain;
  elements.uploadSubText.textContent = dict.uploadSub;
  elements.resultTitle.textContent = dict.resultTitle;
  elements.organicRemediesTitle.textContent = dict.organicTitle;
  elements.chemicalRemediesTitle.textContent = dict.chemicalTitle;
  elements.preventativeMeasuresTitle.textContent = dict.preventativeTitle;
  elements.advisoryHeading.textContent = dict.advisoryHeading;
  elements.advisorySub.textContent = dict.advisorySub;
  elements.weatherTempLabel.textContent = dict.tempLabel;
  elements.weatherHumidityLabel.textContent = dict.humidityLabel;
  elements.weatherConditionLabel.textContent = dict.conditionLabel;
  elements.advisorTipTitle.textContent = dict.advisorTipTitle;
  elements.chatHeading.textContent = dict.chatHeading;
  elements.chatSub.textContent = dict.chatSub;
  elements.settingsModalTitle.textContent = dict.settingsTitle;
  elements.settingsInstruction.textContent = dict.settingsInstruction;
  elements.apiKeyLabel.textContent = dict.apiKeyLabel;
  elements.saveSettingsBtn.textContent = dict.saveSettingsBtn;
  elements.severityLabel.textContent = dict.severityLabel;
  elements.healthStatusBadge.textContent = dict.healthStatusBadge;

  if (!elements.btnLoader.classList.contains("hidden")) {
    elements.analyzeBtnText.textContent = dict.analyzeBtnLoading;
  } else {
    elements.analyzeBtnText.textContent = dict.analyzeBtn;
  }

  elements.speakBtnText.textContent = dict.speakBtnText;

  elements.chatInput.placeholder = dict.chatPlaceholder;

  if (state.chatHistory.length === 0) {
    elements.chatWelcomeMsg.textContent = dict.chatWelcome;
  }
}

function openSettings() {
  elements.apiKeyInput.value = state.apiKey;
  updateKeyStatusDisplay();
  elements.settingsModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeSettings() {
  elements.settingsModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function saveSettings() {
  const value = elements.apiKeyInput.value.trim();
  state.apiKey = value;
  localStorage.setItem("krishi_gemini_api_key", value);
  updateKeyStatusDisplay();
  closeSettings();
  showToast(TRANSLATIONS[state.currentLanguage].toastKeySaved);

  checkAnalyzeButtonState();
}

function updateKeyStatusDisplay() {
  const dict = TRANSLATIONS[state.currentLanguage];
  if (state.apiKey) {
    elements.keyStatus.textContent =
      state.currentLanguage === "en"
        ? "✓ Key Saved"
        : state.currentLanguage === "hi"
          ? "✓ कुंजी सुरक्षित"
          : "✓ ਕੁੰਜੀ ਸੁਰੱਖਿਅਤ";
    elements.keyStatus.className = "key-status-indicator saved";
  } else {
    elements.keyStatus.textContent =
      state.currentLanguage === "en"
        ? "✗ No key saved"
        : state.currentLanguage === "hi"
          ? "✗ कोई कुंजी नहीं सहेजी गई"
          : "✗ ਕੋਈ ਕੁੰਜੀ ਨਹੀਂ";
    elements.keyStatus.className = "key-status-indicator";
  }
}

function handleFileSelect(e) {
  if (e.target.files.length > 0) {
    processFile(e.target.files[0]);
  }
}

function processFile(file) {
  if (!file.type.startsWith("image/")) {
    showToast("Invalid file type. Please upload an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    state.selectedImageBase64 = e.target.result.split(",")[1];
    state.selectedImageMimeType = file.type;

    elements.uploadPreview.src = e.target.result;
    elements.previewContainer.classList.remove("hidden");

    checkAnalyzeButtonState();
    showToast(TRANSLATIONS[state.currentLanguage].toastImageReady);
  };
  reader.readAsDataURL(file);
}

function clearImageUpload() {
  state.selectedImageBase64 = null;
  state.selectedImageMimeType = null;
  elements.fileInput.value = "";
  elements.uploadPreview.src = "";
  elements.previewContainer.classList.add("hidden");
  elements.resultsContainer.classList.add("hidden");
  elements.analyzeBtn.disabled = true;

  if (state.speechSynthesisActive) {
    window.speechSynthesis.cancel();
    state.speechSynthesisActive = false;
    elements.readAloudBtn.classList.remove("speaking");
  }

  showToast(TRANSLATIONS[state.currentLanguage].toastImageRemoved);
}

function checkAnalyzeButtonState() {
  if (state.selectedImageBase64) {
    elements.analyzeBtn.disabled = false;
  } else {
    elements.analyzeBtn.disabled = true;
  }
}

function updateWeatherAdvisory(region) {
  const data = weatherDatabase[region];
  elements.weatherTemp.textContent = data.temp;
  elements.weatherHumidity.textContent = data.humidity;
  elements.weatherCondition.textContent = data.condition;

  const dict = TRANSLATIONS[state.currentLanguage];
  elements.weatherAdvisoryText.textContent = dict.defaultAdvisories[region];

  triggerWeatherAIAdvisory(region);
}

let advisoryTimeout = null;
async function triggerWeatherAIAdvisory(region) {
  clearTimeout(advisoryTimeout);
  advisoryTimeout = setTimeout(async () => {
    const data = weatherDatabase[region];
    const prompt = `You are a professional agricultural meteorologist. Create a short 2-sentence agricultural weather advisory for farmers in ${region.toUpperCase()}, Madhya Pradesh. 
    Current weather condition: Temperature ${data.temp}, Humidity ${data.humidity}, Sky Condition: ${data.condition}. 
    Provide actionable crop actions in ${state.currentLanguage === "hi" ? "Hindi language" : state.currentLanguage === "pa" ? "Punjabi language" : "English language"}. 
    Make sure it is concise (max 40 words) and targets Central Indian regional seasonal crops (Soybean, Wheat, Pulses, Gram, Vegetables). Do not include any JSON wrapper.`;

    try {
      const response = await fetch("/api/advisory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, apiKey: state.apiKey }),
      });

      const result = await response.json();
      if (response.ok && result.advisory && result.advisory.trim()) {
        elements.weatherAdvisoryText.textContent = result.advisory.trim();
      }
    } catch (e) {
      console.warn(
        "Failed to generate dynamic AI weather advisory. Using fallback local templates.",
        e,
      );
    }
  }, 1500);
}

async function runCropDiagnosis() {
  const dict = TRANSLATIONS[state.currentLanguage];

  if (!state.apiKey) {
    showToast(dict.toastKeyMissing);
    return;
  }

  if (!state.selectedImageBase64) {
    showToast(dict.toastNoImage);
    return;
  }

  elements.btnLoader.classList.remove("hidden");
  elements.analyzeBtn.disabled = true;
  elements.analyzeBtnText.textContent = dict.analyzeBtnLoading;
  elements.resultsContainer.classList.add("hidden");

  if (state.speechSynthesisActive) {
    window.speechSynthesis.cancel();
    state.speechSynthesisActive = false;
    elements.readAloudBtn.classList.remove("speaking");
  }

  const langInstruct = {
    en: "English. Ensure terms like remedies and chemical control instructions are in English.",
    hi: "Hindi (हिंदी). Ensure the entire JSON structure content is translated into Hindi script.",
    pa: "Punjabi (ਪੰਜਾਬੀ). Ensure the entire JSON structure content is translated into Punjabi script.",
  };

  const prompt = `You are an expert plant pathologist and agronomist at IIT Ropar's Annam.AI research lab.
Analyze this crop leaf image. You MUST return a JSON response containing crop diagnosis details.
The text output fields MUST be entirely written in ${langInstruct[state.currentLanguage]}.

Your response must strictly conform to this JSON schema:
{
  "crop": "Name of the crop (e.g. Tomato, Cotton)",
  "disease": "Common name of identified disease, pest issue, or nutrient deficiency",
  "severity": "High / Medium / Low",
  "organic": [
    "bullet point 1 for organic remedy",
    "bullet point 2 for organic remedy"
  ],
  "chemical": [
    "bullet point 1 for chemical pesticide/fungicide/fertilizer treatment",
    "bullet point 2 for chemical treatment"
  ],
  "preventative": "Short paragraph outlining crop rotation, watering, or spacing guidelines to prevent recurrences."
}

Do not include any Markdown wrap like \`\`\`json \`\`\`. Just return raw valid JSON.`;

  try {
    const response = await fetch("/api/diagnose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        selectedImageBase64: state.selectedImageBase64,
        selectedImageMimeType: state.selectedImageMimeType,
        apiKey: state.apiKey,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.diagnosis) {
      throw new Error(data.error || `HTTP status ${response.status}`);
    }

    const diagnosis = data.diagnosis;

    renderDiagnosisResults(diagnosis);
    showToast(dict.toastScanSuccess);
  } catch (error) {
    console.error("Diagnosis error:", error);
    showToast(dict.toastScanFailed);
  } finally {
    elements.btnLoader.classList.add("hidden");
    elements.analyzeBtn.disabled = false;
    elements.analyzeBtnText.textContent = dict.analyzeBtn;
  }
}

function renderDiagnosisResults(data) {
  const dict = TRANSLATIONS[state.currentLanguage];

  elements.resultCropName.textContent = `${state.currentLanguage === "en" ? "Crop" : state.currentLanguage === "hi" ? "फसल" : "ਫ਼ਸਲ"}: ${data.crop}`;
  elements.resultIssueName.textContent = data.disease;
  elements.resultSeverity.textContent = data.severity;

  const sev = (data.severity || "").toLowerCase();
  elements.resultSeverity.className = "severity-badge";
  if (sev.includes("high") || sev.includes("उच्च") || sev.includes("ਉੱਚ")) {
    elements.resultSeverity.classList.add("high");
  } else if (
    sev.includes("medium") ||
    sev.includes("मध्यम") ||
    sev.includes("ਦਰਮਿਆਨਾ")
  ) {
    elements.resultSeverity.classList.add("medium");
  } else {
    elements.resultSeverity.classList.add("low");
  }

  elements.resultOrganic.innerHTML = "";
  if (Array.isArray(data.organic)) {
    data.organic.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      elements.resultOrganic.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = data.organic;
    elements.resultOrganic.appendChild(li);
  }

  elements.resultChemical.innerHTML = "";
  if (Array.isArray(data.chemical)) {
    data.chemical.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      elements.resultChemical.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = data.chemical;
    elements.resultChemical.appendChild(li);
  }

  elements.resultPreventative.textContent = data.preventative;

  const organicStr = Array.isArray(data.organic)
    ? data.organic.join(", ")
    : data.organic;
  const chemicalStr = Array.isArray(data.chemical)
    ? data.chemical.join(", ")
    : data.chemical;

  if (state.currentLanguage === "en") {
    state.currentDiagnosisText = `Crop diagnosed is ${data.crop}. Identified condition is ${data.disease} with ${data.severity} severity. Organic remedy: ${organicStr}. Chemical control: ${chemicalStr}. Preventative advice: ${data.preventative}`;
  } else if (state.currentLanguage === "hi") {
    state.currentDiagnosisText = `फसल है ${data.crop}। रोग की पहचान की गई है ${data.disease} जो की ${data.severity} स्तर का है। जैविक उपाय: ${organicStr}। रासायनिक उपाय: ${chemicalStr}। निवारक सलाह: ${data.preventative}`;
  } else {
    state.currentDiagnosisText = `ਫ਼ਸਲ ਹੈ ${data.crop}। ਬਿਮਾਰੀ ਲੱਭੀ ਗਈ ਹੈ ${data.disease} ਜਿਸਦੀ ਤੀਬਰਤਾ ${data.severity} ਹੈ। ਜੈਵਿਕ ਇਲਾਜ: ${organicStr}। ਰਸਾਇਣਕ ਰੋਕਥਾਮ: ${chemicalStr}। ਬਚਾਅ ਦੀ ਸਲਾਹ: ${data.preventative}`;
  }

  elements.resultsContainer.classList.remove("hidden");
}

function toggleDiagnosisSpeech() {
  const dict = TRANSLATIONS[state.currentLanguage];

  if (!("speechSynthesis" in window)) {
    showToast(dict.toastSpeechNotSupported);
    return;
  }

  if (!state.currentDiagnosisText) {
    showToast(dict.toastNoDiagnosis);
    return;
  }

  if (state.speechSynthesisActive) {
    window.speechSynthesis.cancel();
    state.speechSynthesisActive = false;
    elements.readAloudBtn.classList.remove("speaking");
    elements.speakBtnText.textContent = dict.speakBtnText;
    showToast(dict.toastSpeakStop);
  } else {
    if (!state.currentDiagnosisText) return;

    state.speechSynthesisActive = true;
    elements.readAloudBtn.classList.add("speaking");
    elements.speakBtnText.textContent =
      state.currentLanguage === "en"
        ? "Stop"
        : state.currentLanguage === "hi"
          ? "रोकें"
          : "ਰੋਕੋ";
    showToast(dict.toastSpeakStart);

    const utterance = new SpeechSynthesisUtterance(state.currentDiagnosisText);

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (state.currentLanguage === "hi") {
      selectedVoice = voices.find((v) => v.lang.startsWith("hi"));
    } else if (state.currentLanguage === "pa") {
      selectedVoice =
        voices.find((v) => v.lang.startsWith("pa")) ||
        voices.find((v) => v.lang.startsWith("hi"));
    } else {
      selectedVoice = voices.find((v) => v.lang.startsWith("en"));
    }

    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = () => {
      state.speechSynthesisActive = false;
      elements.readAloudBtn.classList.remove("speaking");
      elements.speakBtnText.textContent = dict.speakBtnText;
    };

    utterance.onerror = () => {
      state.speechSynthesisActive = false;
      elements.readAloudBtn.classList.remove("speaking");
      elements.speakBtnText.textContent = dict.speakBtnText;
    };

    window.speechSynthesis.speak(utterance);
  }
}

function toggleVoiceInput() {
  const dict = TRANSLATIONS[state.currentLanguage];

  if (!state.recognition) {
    showToast(dict.toastSpeechInputNotSupported);
    return;
  }

  if (state.recognitionActive) {
    state.recognition.stop();
  } else {
    const localeMap = { en: "en-IN", hi: "hi-IN", pa: "pa-IN" };
    state.recognition.lang = localeMap[state.currentLanguage];
    state.recognition.start();
  }
}

async function handleChatSubmit() {
  const dict = TRANSLATIONS[state.currentLanguage];
  const query = elements.chatInput.value.trim();
  if (!query) return;

  if (!state.apiKey) {
    showToast(dict.toastKeyMissing);
    return;
  }

  appendChatMessage(query, "user");
  elements.chatInput.value = "";

  const thinkingId = appendChatThinkingBubble();

  state.chatHistory.push({ role: "user", content: query });
  if (state.chatHistory.length > 8) {
    state.chatHistory.shift();
  }

  const systemPrompt = `You are Yaksha, an expert agriculture chatbot created by IIT Ropar's Vicharanashala Lab under the Annam.AI initiative. 
  Your task is to advise farmers in Madhya Pradesh and Central India about farming practices. 
  Answer the questions in the user's selected language: ${state.currentLanguage === "hi" ? "Hindi (हिंदी)" : state.currentLanguage === "pa" ? "Punjabi (ਪੰਜਾਬੀ)" : "English"}.
  Be direct, helpful, and concise (max 80 words per reply). Provide practical information on soil preparation, sowing dates for major crops like soybean, wheat (Sharbati), pulses, organic composting, fertilizer dosage, crop diseases, and climate actions.`;

  try {
    const contents = state.chatHistory.map((item) => ({
      role: item.role === "user" ? "user" : "model",
      parts: [{ text: item.content }],
    }));

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        apiKey: state.apiKey,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.reply) {
      throw new Error(data.error || `HTTP status ${response.status}`);
    }

    const replyText = data.reply;

    removeChatThinkingBubble(thinkingId);
    appendChatMessage(replyText.trim(), "system");

    state.chatHistory.push({ role: "model", content: replyText.trim() });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    removeChatThinkingBubble(thinkingId);
    appendChatMessage(
      "Apologies, I encountered an issue while contacting the server. Please try again later.",
      "system",
    );
  }
}

function appendChatMessage(text, role) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg ${role}`;

  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "msg-bubble";
  bubbleDiv.textContent = text;

  msgDiv.appendChild(bubbleDiv);
  elements.chatBox.appendChild(msgDiv);

  elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
}

function appendChatThinkingBubble() {
  const id = "thinking-" + Date.now();
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg system`;
  msgDiv.id = id;

  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "msg-bubble";
  bubbleDiv.innerHTML = `<span class="loader" style="border-width:2px; width:12px; height:12px; border-color: rgba(15,118,110,0.3); border-top-color:var(--primary-color); display:inline-block;"></span>`;

  msgDiv.appendChild(bubbleDiv);
  elements.chatBox.appendChild(msgDiv);
  elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
  return id;
}

function removeChatThinkingBubble(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

async function callGeminiText(prompt) {
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Advisory generation failed");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

let toastTimeout = null;
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 3500);
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
