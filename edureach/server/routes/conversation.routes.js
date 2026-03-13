const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { getAll, getOne, create, update, remove } = require('../controllers/conversation.controller');

router.use(verifyToken);

router.get('/',      getAll);
router.get('/:id',   getOne);
router.post('/',     create);
router.put('/:id',   update);
router.delete('/:id', remove);

module.exports = router;
