import { test, expect } from '@playwright/test';

test.describe('Luồng đăng nhập (Login Flow)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Hiển thị đầy đủ form đăng nhập', async ({ page }) => {
    await expect(page.getByPlaceholder('Tên đăng nhập')).toBeVisible();
    await expect(page.getByPlaceholder('Mật khẩu')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
    await expect(page.getByText('Lưu đăng nhập')).toBeVisible();
  });

  test('Hiển thị cảnh báo khi để trống thông tin đăng nhập', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Tên đăng nhập');
    const passwordInput = page.getByPlaceholder('Mật khẩu');

    await usernameInput.fill('');
    await passwordInput.fill('');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page.getByText('Vui lòng nhập tên đăng nhập!')).toBeVisible();
    await expect(page.getByText('Vui lòng nhập mật khẩu!')).toBeVisible();
  });

  test('Hiển thị thông báo lỗi khi đăng nhập sai thông tin', async ({ page }) => {
    await page.getByPlaceholder('Tên đăng nhập').fill('sai_tai_khoan_123');
    await page.getByPlaceholder('Mật khẩu').fill('sai_mat_khau_123');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page.locator('.ant-message-error')).toContainText(
      'Tên đăng nhập hoặc mật khẩu không đúng!'
    );
  });

  test('Đăng nhập thành công và chuyển hướng đến trang Shop', async ({ page }) => {
    await page.getByPlaceholder('Tên đăng nhập').fill('emilys');
    await page.getByPlaceholder('Mật khẩu').fill('emilyspass');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).toHaveURL(/.*shop/, { timeout: 10000 });

    await expect(page.locator('header')).toContainText('Mobile Shopping');
    await expect(page.getByRole('heading', { name: 'Shop', level: 2 })).toBeVisible();
  });
});
