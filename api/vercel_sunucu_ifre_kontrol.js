// Vercel Serverless Function — Yönetim Paneli Sunucu Taraflı Şifre Doğrulama
module.exports = function handler(req, res) {
  // Sadece POST isteklerine izin ver
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, mesaj: 'Geçersiz istek yöntemi.' });
  }

  try {
    // İstek gövdesini güvenli şekilde ayrıştır
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { sifre } = body;

    // Şifre kaynak kodda değil, yalnızca Vercel Environment Variables ayarında saklanır
    const adminSifre = process.env.ADMIN_SIFRE;

    if (!adminSifre) {
      return res.status(500).json({
        ok: false,
        mesaj: 'Vercel Environment Variables ayarında ADMIN_SIFRE tanımlı değil.'
      });
    }

    // Yönetici (Tam Yetki) kontrolü
    if (sifre === adminSifre) {
      return res.status(200).json({ ok: true, rol: 'admin' });
    }

    return res.status(401).json({ ok: false, mesaj: 'Girilen yönetici şifresi hatalı.' });
  } catch (error) {
    return res.status(400).json({ ok: false, mesaj: 'İstek verisi işlenemedi.' });
  }
};