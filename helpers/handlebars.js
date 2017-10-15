function hbsHelpers(hbs) {
  return hbs.create({
    helpers: { // This was missing
      json:function(context) {
        return JSON.stringify(context).replace(/"/g, '&quot;');
      },
      substring:function(context) {
        return context.substring(0,200)+"...";
      }
    }
  });
}

module.exports = hbsHelpers;
