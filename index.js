/**
* @param {object} root - The object to walk
* @param {function} fn - A function to call on each node
*/
module.exports = function walkObject(root, fn)
{
  async function walk(value, location = [])
  {
    // Value is an array, call walk on each item in the array
    if(Array.isArray(value))
      return await Promise.all(
        fn({value, location}),
        ...value.map((el, j) => walk(el, [...location, j]))
      )

    // Value is an object, walk the keys of the object
    if(value && value.constructor.name === 'Object')
    {
      const entries = Object.entries(value)

      return await Promise.all(
        fn({value, location}),
        ...entries.map(([key, value]) => walk(value, [...location, key]))
      )
    }

    // We've reached a leaf node, call fn on the leaf with the location
    return await fn({value, location, isLeaf: true})
  }

  return walk(root)
}
