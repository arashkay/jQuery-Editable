/*
 *
 * jQuery Editables 1.0.1.3 (jimk branch)
 * 
 * Date: Aug 11 2012
 * Source: www.tectual.com.au, www.arashkarimzadeh.com
 * Author: Arash Karimzadeh (arash@tectual.com.au)
 * Contributors: Jim Kinsman (relipse@gmail.com)
 * 
 * Copyright (c) 2012 Tectual Pty. Ltd.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($){
 
$.fn.editables = function(options, arg2){
  
  //if we already have an existing editable plugin, go ahead and call a method 
  //@see this.methods = { ...
  if (typeof(options) == 'string'){
     $('[data-type=editable]', this).each(function(){
         if (typeof(this.methods[options]) == 'function'){
            this.methods[options].call(arg2);
         }
     });
     return;
  }
  
  var opts = $.extend( {}, $.fn.editables.options, options );
  
  if(!$.isArray(opts.freezeOn)) opts.freezeOn = [opts.freezeOn];
  if(!$.isArray(opts.editOn)) opts.editOn = [opts.editOn];

  $('[data-type=editable]', this).each(
    function(){
      var $this = $(this);
      this.methods = {
         freeze : function(ev) {
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
              }else if (t.data('oldvalue') == t.val()){
                 //value never changed
                 return;
              }
              t.trigger('onFreeze');
         },
         edit : function(ev){
              var t = $($this.data('for'));
              if(opts.beforeEdit.call($this, t, ev)==false) return;
              $this.hide();
              t.show().focus();
              t.data('oldvalue', t.val());
              $this.trigger('onEdit');
         }
      };
      
      var fn = this.methods.freeze;
      var evs= {};
      $.each( opts.freezeOn, function(){ evs[this] = fn; } );
      $($this.data('for')).hide().bind('onFreeze', opts.onFreeze).bind(evs);
      
      var fn = this.methods.edit;
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
