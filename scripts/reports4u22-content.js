// "use strict";

// // Storage variable for extracted PDF data
// let extractedPDFData = null;
// let pdfjsLibInitialized = false;
// let pdfjsLib = null;
// let isFetchingPdf = false;

// // Function to dynamically load PDF.js if not already available
// async function ensurePDFJSLoaded() {
//     try {
//         console.log('Starting PDF.js initialization...');

//         // If already initialized, return immediately
//         if (pdfjsLibInitialized && pdfjsLib) {
//             console.log('PDF.js already initialized, reusing instance');
//             return true;
//         }

//         // Try several methods to get PDF.js
//         // Method 1: Check if it's in window object
//         if (window['pdfjs-dist/build/pdf']) {
//             pdfjsLib = window['pdfjs-dist/build/pdf'];
//             pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdfjs-5.2.133-legacy-dist/build/pdf.worker.js');
//             console.log('Using existing PDF.js from window object');
//             pdfjsLibInitialized = true;
//             return true;
//         }

//         // Method 2: Try to dynamically load the script
//         console.log('Loading PDF.js script dynamically');

//         // First load the main script
//         await loadScript(chrome.runtime.getURL('pdfjs-5.2.133-legacy-dist/build/pdf.js'));
//         console.log('Main PDF.js script loaded');

//         // Wait a moment for initialization
//         await new Promise(resolve => setTimeout(resolve, 300));

//         // Check if PDF.js is available now
//         if (window['pdfjs-dist/build/pdf']) {
//             pdfjsLib = window['pdfjs-dist/build/pdf'];
//             pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdfjs-5.2.133-legacy-dist/build/pdf.worker.js');
//             console.log('Successfully initialized PDF.js after dynamic loading');
//             pdfjsLibInitialized = true;
//             return true;
//         }

//         // Method 3: Try direct import (as a fallback)
//         try {
//             console.log('Attempting to load PDF.js as module');
//             const pdfModule = await import(chrome.runtime.getURL('pdfjs-5.2.133-legacy-dist/build/pdf.js'));
//             pdfjsLib = pdfModule.default;
//             pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdfjs-5.2.133-legacy-dist/build/pdf.worker.js');
//             console.log('Successfully loaded PDF.js as module');
//             pdfjsLibInitialized = true;
//             return true;
//         } catch (moduleError) {
//             console.error('Failed to load PDF.js as module:', moduleError);
//         }

//         // If we get here, all methods failed
//         throw new Error('All PDF.js initialization methods failed');
//     } catch (err) {
//         console.error('Error initializing PDF.js:', err);
//         pdfjsLibInitialized = false;
//         return false;
//     }
// }

// // Helper function to load a script
// function loadScript(url) {
//     return new Promise((resolve, reject) => {
//         const script = document.createElement('script');
//         script.src = url;
//         script.onload = resolve;
//         script.onerror = (e) => {
//             console.error('Script load error:', e);
//             reject(new Error(`Failed to load script from ${url}: ${e.message || 'unknown error'}`));
//         };
//         document.head.appendChild(script);
//         console.log(`Injected script: ${url}`);
//     });
// }

// // Initialize PDF.js when content script loads
// window.addEventListener('load', () => {
//     console.log('Content script loaded, attempting to initialize PDF.js');
//     ensurePDFJSLoaded().then(success => {
//         if (success) {
//             console.log('PDF.js initialized successfully on page load');
//         } else {
//             console.error('Failed to initialize PDF.js on page load');
//         }
//     });
// });

// // Function to fetch and parse PDF from reports URL
// async function fetchAndParsePDF(url) {
//     try {
//         if (isFetchingPdf) {
//             console.log('Already fetching a PDF, waiting for completion');
//             return null;
//         }

//         isFetchingPdf = true;
//         console.log('Fetching PDF from:', url);

//         // Make sure PDF.js is loaded before proceeding
//         if (!pdfjsLibInitialized) {
//             console.log('PDF.js not initialized, attempting initialization');
//             const success = await ensurePDFJSLoaded();
//             if (!success) {
//                 throw new Error('PDF.js library could not be initialized');
//             }
//         }

//         // Fetch the PDF document
//         console.log('Fetching PDF document');
//         const response = await fetch(url, {
//             credentials: 'include', // Include cookies for authenticated requests
//             cache: 'no-store', // Don't use cached version
//             headers: {
//                 'pragma': 'no-cache',
//                 'cache-control': 'no-cache'
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const arrayBuffer = await response.arrayBuffer();
//         console.log('PDF data fetched, size:', arrayBuffer.byteLength);

//         if (arrayBuffer.byteLength === 0) {
//             throw new Error('Received empty PDF data');
//         }

//         // Load the PDF document using PDF.js
//         console.log('Loading PDF with PDF.js');
//         const loadingTask = pdfjsLib.getDocument({
//             data: arrayBuffer,
//             cMapUrl: chrome.runtime.getURL('pdfjs-5.2.133-legacy-dist/cmaps/'),
//             cMapPacked: true,
//             standardFontDataUrl: chrome.runtime.getURL('pdfjs-5.2.133-legacy-dist/standard_fonts/')
//         });

//         const pdfDocument = await loadingTask.promise;
//         console.log('PDF loaded successfully, pages:', pdfDocument.numPages);

//         // Extract text from all pages
//         const extractedData = await extractPDFData(pdfDocument);

//         // Store in global variable
//         extractedPDFData = extractedData;

//         isFetchingPdf = false;
//         return extractedData;
//     } catch (error) {
//         isFetchingPdf = false;
//         console.error('Error fetching/parsing PDF:', error);
//         throw error;
//     }
// }

// // Function to extract statistical data from PDF
// async function extractPDFData(pdfDocument) {
//     const extractedData = {
//         courseInfo: {
//             number: null,
//             name: null
//         },
//         statistics: {
//             average: null,
//             median: null,
//             stdDev: null,
//             passRate: null,
//             totalStudents: null,
//             lecturers: [],
//             grades: {
//                 '0-54': null,
//                 '55-59': null,
//                 '60-64': null,
//                 '65-69': null,
//                 '70-74': null,
//                 '75-79': null,
//                 '80-84': null,
//                 '85-89': null,
//                 '90-94': null,
//                 '95-100': null
//             }
//         },
//         examType: null,
//         semester: null,
//         year: null,
//         rawText: ''
//     };

//     try {
//         let allText = '';

//         // Extract text from all pages
//         for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
//             const page = await pdfDocument.getPage(pageNum);
//             const textContent = await page.getTextContent();

//             // Combine all text items into a single string
//             const pageText = textContent.items.map(item => item.str).join(' ');
//             allText += pageText + ' ';
//         }

//         extractedData.rawText = allText;

//         // Parse the text to extract statistical information
//         parseStatisticalData(allText, extractedData);

//         console.log('Extracted data:', extractedData);
//         return extractedData;
//     } catch (error) {
//         console.error('Error extracting PDF data:', error);
//         throw error;
//     }
// }

// // Function to parse statistical data from PDF text
// function parseStatisticalData(text, extractedData) {
//     // Clean up text by removing extra spaces and normalizing
//     const cleanText = text.replace(/\s+/g, ' ').trim();

//     // Try specialized BGU format parser first (for the format shown in the images)
//     parseBGUStatisticsFormat(cleanText, extractedData);

//     // If key statistics are still missing, fall back to generic patterns
//     if (!extractedData.statistics.average || !extractedData.statistics.totalStudents) {
//         // Extract course number and name
//         const courseNumberMatch = cleanText.match(/קורס\s*[:\s]*(\d+\.\d+\.\d+)/) ||
//             cleanText.match(/(\d{3}\.\d\.\d{4})/);
//         if (courseNumberMatch) {
//             extractedData.courseInfo.number = courseNumberMatch[1].trim();
//         }

//         // Look for course title (could be in Hebrew)
//         const courseTitleMatch = cleanText.match(/חדוא 2 למדעי המחשב והנדסת תוכנה/) ||
//             cleanText.match(/[^\d]+(?=\s*\d{3}\.\d\.\d{4})/);
//         if (courseTitleMatch) {
//             extractedData.courseInfo.name = courseTitleMatch[0].trim();
//         }

//         // Extract date information from the first line format like "2025/1 (ציון סופי לכלל הנבחנים)"
//         const yearSemesterMatch = cleanText.match(/(\d{4})\/(\d).*?\(ציון סופי/);
//         if (yearSemesterMatch) {
//             extractedData.year = parseInt(yearSemesterMatch[1]);
//             extractedData.semester = yearSemesterMatch[2];
//             extractedData.examType = "final";
//         }

//         // Extract average - looking for specific patterns from the images
//         const averageMatch = cleanText.match(/ממוצע\s*(\d+\.\d+)/) ||
//             cleanText.match(/Average\s*(\d+\.\d+)/);
//         if (averageMatch) {
//             extractedData.statistics.average = parseFloat(averageMatch[1]);
//         }

//         // Extract median - looking for specific patterns from the images
//         const medianMatch = cleanText.match(/חציון\s*(\d+\.\d+)/) ||
//             cleanText.match(/Median\s*(\d+\.\d+)/);
//         if (medianMatch) {
//             extractedData.statistics.median = parseFloat(medianMatch[1]);
//         }

//         // Extract standard deviation - looking for specific patterns from the images
//         const stdDevMatch = cleanText.match(/סטיית תקן\s*(\d+\.\d+)/) ||
//             cleanText.match(/Standard Deviation\s*(\d+\.\d+)/) ||
//             cleanText.match(/סטית תקן\s*(\d+\.\d+)/);
//         if (stdDevMatch) {
//             extractedData.statistics.stdDev = parseFloat(stdDevMatch[1]);
//         }

//         // Extract total students - looking for specific patterns from the images
//         const totalStudentsMatch = cleanText.match(/סך תלמידים\s*(\d+)/) ||
//             cleanText.match(/Total Students\s*(\d+)/) ||
//             cleanText.match(/סה"כ נבחנים\s*(\d+)/) ||
//             cleanText.match(/סך הכל\s*(\d+)/);
//         if (totalStudentsMatch) {
//             extractedData.statistics.totalStudents = parseInt(totalStudentsMatch[1]);
//         }

//         // Look for passing rate - need to compute from grade distribution if not directly provided
//         // From the images, this doesn't appear as text but might need to be calculated

//         // Extract grade distributions - use patterns that match the PDFs shown in the images
//         const gradeRanges = [
//             { key: '0-54', pattern: /0-55\s*(\d+)/ },
//             { key: '55-59', pattern: /56-59\s*(\d+)/ },
//             { key: '60-64', pattern: /60-64\s*(\d+)/ },
//             { key: '65-69', pattern: /65-69\s*(\d+)/ },
//             { key: '70-74', pattern: /70-74\s*(\d+)/ },
//             { key: '75-79', pattern: /75-79\s*(\d+)/ },
//             { key: '80-84', pattern: /80-84\s*(\d+)/ },
//             { key: '85-89', pattern: /85-89\s*(\d+)/ },
//             { key: '90-94', pattern: /90-94\s*(\d+)/ },
//             { key: '95-100', pattern: /94<\s*(\d+)/ }
//         ];

//         // Extract each grade range count
//         gradeRanges.forEach(range => {
//             const match = cleanText.match(range.pattern);
//             if (match) {
//                 extractedData.statistics.grades[range.key] = parseInt(match[1]);
//             }
//         });

//         // Compute pass rate if not found directly (students with grades 55+ divided by total)
//         if (extractedData.statistics.passRate === null && extractedData.statistics.totalStudents) {
//             let failCount = extractedData.statistics.grades['0-54'] || 0;
//             let totalStudents = extractedData.statistics.totalStudents;
//             if (totalStudents > 0) {
//                 extractedData.statistics.passRate = Math.round((totalStudents - failCount) / totalStudents * 100);
//             }
//         }
//     }

//     console.log('Extracted data:', extractedData);
// }

// // Special function to parse BGU statistics format shown in the images
// function parseBGUStatisticsFormat(text, extractedData) {
//     // Extract the academic year and semester from format like "2025/1 (ציון סופי לכלל הנבחנים)"
//     const yearSemesterMatch = text.match(/(\d{4})\/(\d)\s*\(([^)]+)\)/);
//     if (yearSemesterMatch) {
//         extractedData.year = parseInt(yearSemesterMatch[1]);
//         extractedData.semester = yearSemesterMatch[2];

//         // Determine exam type
//         const examTypeText = yearSemesterMatch[3];
//         if (examTypeText.includes('סופי')) {
//             extractedData.examType = "final";
//         } else if (examTypeText.includes('מבחן')) {
//             const examNumberMatch = examTypeText.match(/מבחן\s*(\d+)/);
//             extractedData.examType = examNumberMatch ? `exam_${examNumberMatch[1]}` : "exam";
//         } else if (examTypeText.includes('בוחן')) {
//             const quizNumberMatch = examTypeText.match(/בוחן\s*(\d+)/);
//             extractedData.examType = quizNumberMatch ? `quiz_${quizNumberMatch[1]}` : "quiz";
//         }
//     }

//     // Extract course number from format like "קורס 201.1.2371"
//     const courseNumberMatch = text.match(/קורס\s*(\d{3}\.\d\.\d{4})/) ||
//         text.match(/(\d{3}\.\d\.\d{4})/);
//     if (courseNumberMatch) {
//         extractedData.courseInfo.number = courseNumberMatch[1].trim();
//     }

//     // Extract course name - in images it's like "חדו"א 2 למדעי המחשב והנדסת תוכנה"
//     const courseNameMatch = text.match(/([א-ת\s\"\'\d]+)(?=\s*\d{3}\.\d\.\d{4})/) ||
//         text.match(/\d{3}\.\d\.\d{4}\s+([א-ת\s\"\'\d]+)/);
//     if (courseNameMatch) {
//         extractedData.courseInfo.name = courseNameMatch[1].trim();
//     }

//     // Extract statistics - matching the exact format from the images
//     // Average (ממוצע)
//     const averageMatch = text.match(/ממוצע\s*(\d+\.\d+)/);
//     if (averageMatch) {
//         extractedData.statistics.average = parseFloat(averageMatch[1]);
//     }

//     // Standard deviation (סטיית תקן)
//     const stdDevMatch = text.match(/סטיית תקן\s*(\d+\.\d+)/);
//     if (stdDevMatch) {
//         extractedData.statistics.stdDev = parseFloat(stdDevMatch[1]);
//     }

//     // Total students (סך תלמידים)
//     const totalStudentsMatch = text.match(/סך תלמידים\s*(\d+)/);
//     if (totalStudentsMatch) {
//         extractedData.statistics.totalStudents = parseInt(totalStudentsMatch[1]);
//     }

//     // Try alternative formats for total students
//     if (!extractedData.statistics.totalStudents) {
//         const altTotalMatch = text.match(/נבחנים\s*(\d+)/) || text.match(/סה"כ\s*(\d+)/);
//         if (altTotalMatch) {
//             extractedData.statistics.totalStudents = parseInt(altTotalMatch[1]);
//         }
//     }

//     // Call the improved grade distribution extractor
//     extractGradeDistribution(text, extractedData);

//     // Calculate pass rate from grade distribution if needed
//     if (!extractedData.statistics.passRate && extractedData.statistics.totalStudents > 0) {
//         const failCount = extractedData.statistics.grades['0-54'] || 0;
//         extractedData.statistics.passRate = Math.round((extractedData.statistics.totalStudents - failCount) /
//             extractedData.statistics.totalStudents * 100);
//     }
// }

// // Function to extract grade distribution - more specific to match the format in the images
// function extractGradeDistribution(text, extractedData) {
//     // Use a more comprehensive approach to extract grade distributions
//     const gradePatterns = [
//         { key: '0-54', patterns: [/0-55\s*(\d+)/, /0\s*[-–]\s*55\s*(\d+)/, /נכשלים\s*[:\s]*(\d+)/i] },
//         { key: '55-59', patterns: [/56-59\s*(\d+)/, /56\s*[-–]\s*59\s*(\d+)/] },
//         { key: '60-64', patterns: [/60-64\s*(\d+)/, /60\s*[-–]\s*64\s*(\d+)/] },
//         { key: '65-69', patterns: [/65-69\s*(\d+)/, /65\s*[-–]\s*69\s*(\d+)/] },
//         { key: '70-74', patterns: [/70-74\s*(\d+)/, /70\s*[-–]\s*74\s*(\d+)/] },
//         { key: '75-79', patterns: [/75-79\s*(\d+)/, /75\s*[-–]\s*79\s*(\d+)/] },
//         { key: '80-84', patterns: [/80-84\s*(\d+)/, /80\s*[-–]\s*84\s*(\d+)/] },
//         { key: '85-89', patterns: [/85-89\s*(\d+)/, /85\s*[-–]\s*89\s*(\d+)/] },
//         { key: '90-94', patterns: [/90-94\s*(\d+)/, /90\s*[-–]\s*94\s*(\d+)/] },
//         { key: '95-100', patterns: [/94<\s*(\d+)/, /95\s*[-–]\s*100\s*(\d+)/, />94\s*(\d+)/] },
//     ];

//     gradePatterns.forEach(range => {
//         for (const pattern of range.patterns) {
//             const match = text.match(pattern);
//             if (match) {
//                 extractedData.statistics.grades[range.key] = parseInt(match[1]);
//                 break;
//             }
//         }
//     });

//     // Try to calculate total students from grade distribution if not available
//     if (!extractedData.statistics.totalStudents) {
//         let total = 0;
//         Object.values(extractedData.statistics.grades).forEach(count => {
//             if (count !== null) total += count;
//         });

//         if (total > 0) {
//             extractedData.statistics.totalStudents = total;
//         }
//     }
// }

// // Helper function to parse semester
// function parseSemester(semesterStr) {
//     const semester = semesterStr.toLowerCase();
//     if (semester.includes('א') || semester.includes('fall') || semester === '1') {
//         return '1';
//     } else if (semester.includes('ב') || semester.includes('spring') || semester === '2') {
//         return '2';
//     } else if (semester.includes('ג') || semester.includes('summer') || semester === '3') {
//         return '3';
//     }
//     return semesterStr;
// }

// // Helper function to parse exam type
// function parseExamType(text, value) {
//     if (text.includes('ציון סופי') || text.includes('Final Grade')) {
//         return 'final';
//     } else if (text.includes('בוחן') || text.includes('Quiz')) {
//         return 'quiz_' + value;
//     } else if (text.includes('מבחן') || text.includes('Exam')) {
//         return 'exam_' + value;
//     }
//     return value;
// }

// // Function to handle PDF URLs from reports4u22
// async function handleReportsURL(url) {
//     try {
//         // Check if this is a reports URL
//         if (url.includes('reports4u22.bgu.ac.il/reports/rwservlet') ||
//             url.includes('reports4u22.bgu.ac.il/GeneratePDF.php')) {

//             console.log('Detected reports URL, parsing PDF...');

//             // Initialize PDF.js if needed
//             if (!pdfjsLibInitialized) {
//                 console.log('PDF.js not initialized for parsing, attempting initialization');
//                 const success = await ensurePDFJSLoaded();
//                 if (!success) {
//                     throw new Error('PDF.js library could not be initialized');
//                 }
//             }

//             const extractedData = await fetchAndParsePDF(url);

//             if (extractedData) {
//                 // Send extracted data to the popup/background script
//                 console.log('Sending extracted data to extension');
//                 chrome.runtime.sendMessage({
//                     type: 'PDF_DATA_EXTRACTED',
//                     data: extractedData,
//                     url: url
//                 });
//             } else {
//                 console.warn('No data extracted from PDF');
//                 throw new Error('No data extracted from PDF');
//             }

//             return extractedData;
//         }
//     } catch (error) {
//         console.error('Error handling reports URL:', error);
//         chrome.runtime.sendMessage({
//             type: 'PDF_PARSE_ERROR',
//             error: error.message || 'Unknown error',
//             url: url
//         });
//         throw error;
//     }
// }

// // Function to get stored PDF data
// function getStoredPDFData() {
//     return extractedPDFData;
// }

// // Ensure connection is established immediately on content script load
// console.log('Content script loaded at reports4u22.bgu.ac.il');
// chrome.runtime.sendMessage({
//     type: 'CONTENT_SCRIPT_LOADED',
//     url: window.location.href
// });

// // Listen for messages from popup to parse specific URLs
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log('Message received in content script:', message.type);

//     if (message.type === 'PARSE_PDF_URL') {
//         // Immediately respond that we received the message
//         sendResponse({ received: true, status: 'processing' });

//         // Process asynchronously, separate from the message response
//         handleReportsURL(message.url)
//             .then(data => {
//                 console.log('Successfully parsed PDF, sending data to popup');
//                 chrome.runtime.sendMessage({
//                     type: 'PDF_PARSE_COMPLETE',
//                     success: true,
//                     data: data,
//                     url: message.url
//                 });
//             })
//             .catch(error => {
//                 // Ensure we're sending a string error message
//                 const errorMessage = error instanceof Error ? error.message : String(error);
//                 console.error('Sending error response:', errorMessage);
//                 chrome.runtime.sendMessage({
//                     type: 'PDF_PARSE_ERROR',
//                     success: false,
//                     error: errorMessage,
//                     url: message.url
//                 });
//             });
//         return true; // Keep message channel open for async response
//     } else if (message.type === 'GET_STORED_DATA') {
//         console.log('Returning stored data:', extractedPDFData !== null);
//         sendResponse({ success: true, data: extractedPDFData });
//         return true;
//     } else if (message.type === 'PING_CONTENT_SCRIPT') {
//         console.log('Received ping, responding with active status');
//         sendResponse({
//             success: true,
//             active: true,
//             pdfjs_initialized: pdfjsLibInitialized,
//             version: '1.1'
//         });
//         return true;
//     } else if (message.type === 'FORCE_RELOAD_PDFJS') {
//         // Force reloading of PDF.js library
//         pdfjsLibInitialized = false;
//         pdfjsLib = null;
//         ensurePDFJSLoaded().then(success => {
//             sendResponse({
//                 success: success,
//                 pdfjs_initialized: pdfjsLibInitialized
//             });
//         });
//         return true;
//     }

//     // Default response for unknown message types
//     console.warn('Unknown message type received:', message.type);
//     sendResponse({ success: false, error: 'Unknown message type' });
//     return false;
// });

// // Auto-detect and parse PDFs when navigating to reports URLs
// if (window.location.href.includes('reports4u22.bgu.ac.il')) {
//     // Wait for page to load then check for PDF content
//     window.addEventListener('load', () => {
//         console.log('Page loaded, checking for PDF content');
//         try {
//             setTimeout(() => {
//                 handleReportsURL(window.location.href).catch(error => {
//                     console.error('Error auto-parsing PDF:', error instanceof Error ? error.message : String(error));
//                 });
//             }, 1000);
//         } catch (error) {
//             console.error('Error in load event handler:', error instanceof Error ? error.message : String(error));
//         }
//     });
// }

// // Export functions for use in popup
// window.fetchStatisticsFromUrl = handleReportsURL;
// window.getStoredPDFData = getStoredPDFData;
