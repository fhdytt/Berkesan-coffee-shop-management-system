const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.get('/stats',   dashboardController.getDashboardStats);
router.get('/rekap',   dashboardController.getRekap);            
router.get('/stok',    dashboardController.getStok);             
router.get('/laporan', dashboardController.getLaporan);          
router.get('/antrean', dashboardController.getAntrean);          
router.get('/kategori', dashboardController.getKategori);
router.post('/kategori', dashboardController.createKategori);
router.get('/menu', dashboardController.getMenu);
router.post('/menu', dashboardController.createMenu);
router.put('/menu/:id', dashboardController.updateMenu);
router.delete('/menu/:id', dashboardController.deleteMenu);
router.get('/meja', dashboardController.getMeja);
router.post('/meja', dashboardController.createMeja);
router.patch('/meja/:id/toggle', dashboardController.toggleMeja);
router.delete('/meja/:id', dashboardController.deleteMeja);

router.get('/users', authMiddleware, authController.getUsers);
router.post('/users', authMiddleware, authController.register);
router.delete('/users/:id', authMiddleware, authController.deleteUser);

module.exports = router;