import express from 'express';

const router = express.Router();

// Liveness check
router.get('/', (req, res) => {
  const version = '<%VERSION_INFO%>';
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(['DSL Backend', version]);
});

module.exports = router;
