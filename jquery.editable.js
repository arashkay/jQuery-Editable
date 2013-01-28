/*
 *
 * jQuery Editables 1.0.1 (jimk branch)
 * 
 * Date: Aug 11 2012
 * Source: www.tectual.com.au, www.arashkarimzadeh.com
 * Author: Arash Karimzadeh (arash@tectual.com.au)
 *
 * Copyright (c) 2012 Tectual Pty. Ltd.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * 27-Jan-2013 JimK: Added beforeFreeze abort option to 
 *     abort editing (using esc key would be a common implementation)
 *     Stored old data in data-oldvalue="foobar"
 */
(function($){
 
$.fn.editables = function(options){
  
  var opts = $.extend( {}, $.fn.editables.options, options );
  
  if(!$.isArray(opts.freezeOn)) opts.freezeOn = [opts.freezeOn];
  if(!$.isArray(opts.editOn)) opts.editOn = [opts.editOn];

  $('[data-type=editable]', this).each(
    function(){
      var $this = $(this);
      var fn = function(ev){
        var t = $($this.data('for'));
        var bf = opts.beforeFreeze.call(t, $this, ev);
        if(bf==false) return;
        t.hide();
        $this.show();
        if (bf === 'abort'){
           if (t.data('oldvalue') !== undefined){
              t.val(t.data('oldvalue'));
           }
           return; //do not call onFreeze, because we aborted freeze
        }
        t.trigger('onFreeze');
      };
      var evs= {};
      $.each( opts.freezeOn, function(){ evs[this] = fn; } );
      $($this.data('for')).hide().bind('onFreeze', opts.onFreeze).bind(evs);
      
      var fn = function(ev){
        var t = $($this.data('for'));
        if(opts.beforeEdit.call($this, t, ev)==false) return;
        $this.hide();
        t.show().focus();
        t.data('oldvalue', t.val());
        $this.trigger('onEdit');
      }
      var evs = {};
      $.each( opts.editOn, function(){ evs[this] = fn; } );
      $this.bind('onEdit', opts.onEdit).bind(evs);
    }
  );
  return this;
}
$.fn.editables.options = {
  editOn: 'click',      /* Event, Array[Events]: All jquery events */
  beforeEdit: $.noop,   /* Function: It is called before conversion, you can stop it by returning false */
  onEdit: $.noop,       /* Function: This function bind to editable item as event */
  freezeOn: 'blur',     /* Event, Array[Events]: All jquery events */
  beforeFreeze: $.noop, /* Function: It is called before conversion, you can stop it by returning false */
  onFreeze: $.noop      /* Function: This function bind to edit field as event */
}

})(jQuery);


