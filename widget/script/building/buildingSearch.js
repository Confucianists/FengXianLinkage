apiready = function() {
    var vue = new Vue({
        el: "#all_con",
        data: {
          isshow:'none',
          isSlideInDown:false
        },
        methods: {
            tjquery: function() {
              this.isshow = 'block';
              this.isSlideInDown = true;
            },
            cover_close:function() {
              this.isshow = 'none'
            }
        } // methods end.

    });

}
