/* Converting the sequelize object to a plain object. */
exports.getPlainObject = function (data) {
  var jsonString = JSON.stringify(data); //convert to string to remove the sequelize specific meta data
  var obj = JSON.parse(jsonString); //to make plain json
  return obj;
};
