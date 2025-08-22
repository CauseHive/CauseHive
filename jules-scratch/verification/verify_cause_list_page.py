from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the cause list page
    page.goto("http://localhost:3000/causelistpage")

    # Wait for the cause grid to be visible, which indicates the page has loaded
    page.wait_for_selector("div[class*='causeGrid']")

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
