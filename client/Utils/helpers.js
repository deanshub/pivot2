import R from 'ramda'

function getByPath(obj, path) {
  return R.view(R.lensPath(path.split('.')), obj)
}

module.exports = {
  getByPath,
}
