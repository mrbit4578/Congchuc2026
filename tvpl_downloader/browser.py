import os
import json
import logging
from typing import Optional
from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s: %(message)s")
logger = logging.getLogger("tvpl_downloader.browser")

COOKIES_FILE = os.path.join(os.path.dirname(__file__), "..", "user_cookies.json")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

class BrowserManager:
    """Manages Playwright browser instance with Cloudflare bypass & session persistence."""
    
    def __init__(self, headless: bool = True, use_chrome: bool = True):
        self.headless = headless
        self.use_chrome = use_chrome
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None

    def start(self) -> BrowserContext:
        self.playwright = sync_playwright().start()
        
        launch_args = [
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-infobars",
            "--window-size=1280,800",
        ]
        
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
        executable_path = CHROME_PATH if (self.use_chrome and os.path.exists(CHROME_PATH)) else None
        
        logger.info(f"Launching Browser (Headless: {self.headless}, Executable: {executable_path or 'Default'})...")
        
        self.browser = self.playwright.chromium.launch(
            executable_path=executable_path,
            headless=self.headless,
            args=launch_args
        )
        
        self.context = self.browser.new_context(
            user_agent=user_agent,
            viewport={"width": 1280, "height": 800},
            accept_downloads=True,
            locale="vi-VN",
            timezone_id="Asia/Ho_Chi_Minh"
        )
        
        # Hide navigator.webdriver
        self.context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)
        
        # Inject saved cookies if available
        if os.path.exists(COOKIES_FILE):
            try:
                with open(COOKIES_FILE, "r", encoding="utf-8") as f:
                    cookies = json.load(f)
                    self.context.add_cookies(cookies)
                    logger.info(f"Loaded {len(cookies)} cookies into browser context")
            except Exception as e:
                logger.warning(f"Could not load cookies: {e}")
                
        return self.context

    def save_cookies(self):
        if self.context:
            cookies = self.context.cookies()
            with open(COOKIES_FILE, "w", encoding="utf-8") as f:
                json.dump(cookies, f, ensure_ascii=False, indent=2)
            logger.info(f"Saved {len(cookies)} cookies to {COOKIES_FILE}")

    def close(self):
        if self.context:
            self.context.close()
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()
        logger.info("Browser session closed.")

def interactive_login():
    """Opens a headful browser for user to log into thuvienphapluat.vn and save cookies."""
    logger.info("Opening browser for login. Please log in on the opened window...")
    bm = BrowserManager(headless=False)
    context = bm.start()
    page = context.new_page()
    page.goto("https://thuvienphapluat.vn/dang-nhap.aspx")
    print("\n" + "="*60)
    print("👉 Hãy đăng nhập tài khoản Thư Viện Pháp Luật trên cửa sổ trình duyệt.")
    print("👉 Sau khi đăng nhập thành công, nhấn ENTER ở cửa sổ lệnh này để lưu session!")
    print("="*60 + "\n")
    input("Nhấn ENTER để kết thúc & lưu cookies...")
    bm.save_cookies()
    bm.close()
    print("✅ Đã lưu phiên đăng nhập thành công!")
