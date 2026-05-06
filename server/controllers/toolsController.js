const axios = require('axios');
const zxcvbn = require('zxcvbn');
const { generatePassword } = require('../utils/password');
const { logAction } = require('../utils/audit');

exports.generate = async (req, res, next) => {
  try {
    const password = generatePassword(req.body);
    const strength = zxcvbn(password);
    res.json({ password, score: strength.score, feedback: strength.feedback });
  } catch (error) {
    next(error);
  }
};

exports.checkBreach = async (req, res, next) => {
  try {
    const { email } = req.body;
    const headers = {
      'User-Agent': 'SecureVault Password Manager'
    };
    if (process.env.HIBP_API_KEY) headers['hibp-api-key'] = process.env.HIBP_API_KEY;
    const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
      headers,
      params: { truncateResponse: false },
      validateStatus: status => [200, 404].includes(status)
    });
    await logAction(req, req.user._id, 'BREACH_CHECK');
    res.json({ breaches: response.status === 404 ? [] : response.data });
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(502).json({ message: 'HaveIBeenPwned requires a valid API key for this request.' });
    }
    next(error);
  }
};
