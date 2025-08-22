from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the cause detail page with a placeholder ID
    page.goto("http://localhost:3000/causedetailpage/123e4567-e89b-12d3-a456-426614174000")

    # Wait for the details to be visible
    page.wait_for_selector("div[class*='details']")

    # Take a screenshot
    page.screenshot(path="verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
