hexo.extend.filter.register('before_generate', function () {
  var posts = hexo.locals.get('posts');
  if (!posts || !posts.length) return;

  posts.data.sort(function (a, b) {
    var aTop = a.top;
    var bTop = b.top;
    if (aTop && !bTop) return -1;
    if (!aTop && bTop) return 1;
    if (aTop && bTop) {
      if (aTop > bTop) return -1;
      if (aTop < bTop) return 1;
      return b.date - a.date;
    }
    return b.date - a.date;
  });

  posts.length = posts.data.length;
});
