

module.exports = (req, res, next) => {
    const childId = sessionStorage.getItem('childId');
  
    if (!childId) {
      return res.status(401).json({ message: 'Child ID is missing, please register a child first.' });
    }
  
    next();
  };
  