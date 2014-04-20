/**
 * Entangle - Reactive Framework
 */

var entangle = (function () {

  function Entangle () { }

  // @interface(converter>function) {{{

  Entangle.prototype.call = function (ctx) {
    var args = Array.prototype.slice.call(arguments, 1);
    return this.apply(ctx, args);
  };

  Entangle.prototype.apply = function (ctx, args) {
    return this.head.apply(this.contextof(this.head, ctx), args);
  };

  // }}}

  Entangle.prototype.contextof = function (converter, context) {

    var _this = this;

    return {

      // resolve - call next converter {{{
      resolve: function () {
        var next = converter.next;
        if (next) {
          // FIXME use arguments expansion here (efficiency)
          fapply(next, _this.contextof(next, context), arguments);
        } else {
          // cascading resolve
          if (context.resolve) fapply(context.resolve, context, arguments);
        }
        return this;
      },
      // }}} resolve

      // failure - TODO issue conversion failure(s) {{{
      failure: function () { return this; },
      // }}} failure

    };

  };

  Entangle.prototype.append = function (converter) {

    if (this.last) {
      this.last.next = converter;
    } else {
      this.head = converter;
    }

    this.last = converter;

    return this;

  };

  return _.extend(function () { return new Entangle(); }, {

    initiator: function (fu) {

      return function () {

        var converter = fapply(fu, this, arguments);

        if (converter) this.append(converter);

        return this;

      };

    },

    extend: function (kis) {
      _.extend(Entangle.prototype, _.transform(kis, function (r, v, k) {
        r[k] = entangle.initiator(v);
      }));
      return _.extend(this, kis);
    }

  });

})();

