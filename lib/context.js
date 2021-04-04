module.exports = ({ userId, postId }) => !postId ? ({ userId }) : ({ userId, postId })
