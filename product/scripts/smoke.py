"""Bounded browser smoke test for the Wendo product front end (demo data source)."""
import re
import sys
from playwright.sync_api import sync_playwright, expect

BASE = "http://127.0.0.1:3100"
SHOT = "/tmp/wendo-report.png"

failures = []


def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + (f" :: {detail}" if detail and not cond else ""))
    if not cond:
        failures.append(name)


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1360, "height": 900})
    page.set_default_timeout(15000)

    # 1. unauthenticated /app must bounce to /login
    page.goto(f"{BASE}/app")
    page.wait_for_url(re.compile(r"/login$"), timeout=15000)
    check("guard: /app -> /login", page.url.endswith("/login"))

    # 2. register with a wrong invite code shows an inline error
    page.goto(f"{BASE}/register")
    page.get_by_label("邀请码").fill("NOPE-0000")
    page.get_by_label("邮箱").fill("tester@example.com")
    page.get_by_label("密码").fill("demo12345")
    page.get_by_role("button", name="创建账号").click()
    page.wait_for_selector("p[role=alert]", timeout=15000)
    check("register: bad invite rejected", "邀请码无效" in page.locator("p[role=alert]").inner_text())

    # 3. login with the demo account
    page.goto(f"{BASE}/login")
    page.get_by_label("邮箱").fill("ray@wendo.cn")
    page.get_by_label("密码").fill("wendo-2026")
    page.get_by_role("button", name="登录", exact=True).click()
    page.wait_for_url(re.compile(r"/app$"), timeout=15000)
    check("login: lands on /app", page.url.endswith("/app"))

    page.wait_for_function(
        "() => document.querySelector('aside')?.innerText.includes('12.4')", timeout=15000
    )
    credit_text = page.locator("aside").inner_text()
    check("shell: credit balance visible", "12.4" in credit_text, credit_text[:120])

    # 4. Pro / Max are disabled, Lite is selectable
    pro = page.get_by_role("radio", name=re.compile("Pro"))
    max_ = page.get_by_role("radio", name=re.compile("Max"))
    check("models: Pro disabled", pro.is_disabled())
    check("models: Max disabled", max_.is_disabled())
    check("models: Lite enabled", page.get_by_role("radio", name=re.compile("Lite")).is_enabled())

    # 5. text diagnosis end to end
    text = (
        "Welcome to Bear Malaysia. Bear Electric Food Steamer BFS-C60L 6L Multifuntion "
        "Double Layer 2 Tiers Pengukus Elektrik Pelbagai Fungsi. Health Pot 1.8L BHP-W18L. "
        "Stew Cooker Recipe. One year warranty with local support, SIRIM certified, standard "
        "3-pin plug. Call us at 03-456 7554 for any enquiry about delivery, warranty or returns."
    )
    page.get_by_label("要诊断的文案").fill(text)
    page.get_by_role("button", name="开始诊断").click()
    page.wait_for_url(re.compile(r"/app/reports/rep_"), timeout=40000)
    check("diagnosis: report route", "/app/reports/" in page.url)

    page.wait_for_selector("article", timeout=15000)
    body = page.locator("article").inner_text()
    check("report: summary block", "概览" in body)
    check("report: priority order", "优先修改顺序" in body)
    check("report: risk list", "风险清单" in body)
    check("report: at least 3 risks", body.count("为什么有问题") >= 3, str(body.count("为什么有问题")))
    check("report: no score wording", "维度分数" not in body and "评分" not in body)
    check("report: disclaimer", "免责声明" in body)
    check("report: pdf control", page.get_by_role("button", name=re.compile("PDF")).count() > 0)

    page.screenshot(path=SHOT, full_page=True)

    # 6. ledger got a new row and the balance dropped
    page.goto(f"{BASE}/app/account")
    page.wait_for_selector("table tbody tr", timeout=15000)
    rows = page.locator("table tbody tr").count()
    check("account: ledger has 4 rows", rows == 4, f"rows={rows}")
    page.goto(f"{BASE}/app")
    page.wait_for_selector("aside", timeout=15000)
    page.wait_for_function(
        "() => !document.querySelector('aside')?.innerText.includes('12.4')", timeout=15000
    )
    check("account: balance decreased", True)

    # 7. sample report from history opens
    page.goto(f"{BASE}/app/reports")
    page.wait_for_selector("text=Bear Malaysia", timeout=15000)
    page.get_by_text("Bear Malaysia - Home Appliances | Cookware").first.click()
    page.wait_for_url(re.compile(r"rep_bear_my_20261112"), timeout=15000)
    check("history: bear sample opens", "rep_bear_my_20261112" in page.url)

    # 8. session survives reload
    page.reload()
    page.wait_for_selector("article", timeout=15000)
    check("session: survives reload", "/app/reports/rep_bear" in page.url)

    # 9. logout returns to landing
    page.goto(f"{BASE}/app/account")
    page.get_by_role("button", name=re.compile("退出登录")).click()
    page.wait_for_url(re.compile(r"/$"), timeout=15000)
    check("logout: back to landing", page.url.rstrip("/") == BASE)

    # 10. public sample works without a session
    ctx = browser.new_context()
    sp = ctx.new_page()
    sp.set_default_timeout(15000)
    sp.goto(f"{BASE}/sample", wait_until="load")
    sp.wait_for_selector("article", timeout=15000)
    sample_body = sp.locator("article").inner_text()
    check("sample: opens unauthenticated", "/sample" in sp.url)
    check("sample: has risks", sample_body.count("为什么有问题") >= 3)
    check("sample: no scores", "评分" not in sample_body)
    ctx.close()

    browser.close()

print("FAILURES:", failures if failures else "none")
sys.exit(1 if failures else 0)
