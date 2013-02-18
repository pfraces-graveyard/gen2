var extend = require('extend'),
    actor = require('actor'),
    render = require('render'),
    matrix = require('matrix');
    

module.exports = function (config) {
  return new Gen(config);
};

var Gen = function (config) {
  var self = this;
  this.actors = [];
  
  this.matrix = matrix({
    width: config.width,
    height: config.height
  });

  this.render = render(extend(config, {
    frame: function () {
      frame(self.matrix, self.actors);
    }
  }));
};

Gen.prototype.actor = function (pos) {
  var a = actor(pos, [{
        tile: this.render.tile(),
        x: 0,
        y: 0
      }]);

  this.actors.push(a);
  return a;
};

var frame = function (matrix, actors) {
  actors.forEach(function (actor) {

    /* game defined actions */
    actor.act();

    /* collision detection */
    actor.members.forEach(function (member) {
      var pos = {
            x: actor.x + member.x,
            y: actor.y + member.y
          },
          target = matrix.at(pos);

      if (target) {
        collisionHandler(actors[actor.id], actors[target]);
      } else {
        matrix.at(pos, actor.id);
      }
    });
  });

  /* render update */
  actors.forEach(function (actor) {
    actor.members.forEach(function (member) {
      member.tile.move(actor.x + member.x, actor.y + member.y)
    });
  });
};

var collisionHandler = function (last, first) {
  last.move.back();
};
