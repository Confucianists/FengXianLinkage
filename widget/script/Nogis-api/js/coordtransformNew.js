var Transformation = function() {
	this.cps = [{sp:{x:7665927.7654916,y:4655360.3929787},tp:{x:108.70222963693,y:34.315080799379}},
				{sp:{x:7672345.5666501,y:4662727.1166699},tp:{x:108.6895159662,y:34.355313934603}},
				{sp:{x:7773779.6851671,y:4815833.9231449},tp:{x:108.33161432856,y:35.112320667961}}];
	//计算参数
	this.caculatParam = function(){
		var equationsO2WX = [
	    	"("+this.cps[0].tp.x+") = y * ("+this.cps[0].sp.x+") + z * ("+this.cps[0].sp.y+") - (1)*x",
	    	"("+this.cps[1].tp.x+") = y * ("+this.cps[1].sp.x+") + z * ("+this.cps[1].sp.y+") - (1)*x",
			"("+this.cps[2].tp.x+") = y * ("+this.cps[2].sp.x+") + z * ("+this.cps[2].sp.y+") - (1)*x"
		];
		var equationsO2WY = [
	    	"("+this.cps[0].tp.y+") = y * ("+this.cps[0].sp.x+") + z * ("+this.cps[0].sp.y+") - (1)*x",
	    	"("+this.cps[1].tp.y+") = y * ("+this.cps[1].sp.x+") + z * ("+this.cps[1].sp.y+") - (1)*x",
			"("+this.cps[2].tp.y+") = y * ("+this.cps[2].sp.x+") + z * ("+this.cps[2].sp.y+") - (1)*x"
		];
		var equationsW2OX = [
	    	"("+this.cps[0].sp.x+") = y * ("+this.cps[0].tp.x+") + z * ("+this.cps[0].tp.y+") - (1)*x",
	    	"("+this.cps[1].sp.x+") = y * ("+this.cps[1].tp.x+") + z * ("+this.cps[1].tp.y+") - (1)*x",
			"("+this.cps[2].sp.x+") = y * ("+this.cps[2].tp.x+") + z * ("+this.cps[2].tp.y+") - (1)*x"
		];
		var equationsW2OY = [
	    	"("+this.cps[0].sp.y+") = y * ("+this.cps[0].tp.x+") + z * ("+this.cps[0].tp.y+") - (1)*x",
	    	"("+this.cps[1].sp.y+") = y * ("+this.cps[1].tp.x+") + z * ("+this.cps[1].tp.y+") - (1)*x",
			"("+this.cps[2].sp.y+") = y * ("+this.cps[2].tp.x+") + z * ("+this.cps[2].tp.y+") - (1)*x"
		];
		this.paramO2WX=LEquat.step(equationsO2WX,12);
		this.paramO2WY=LEquat.step(equationsO2WY,12);
		this.paramW2OX=LEquat.step(equationsW2OX,9);
		this.paramW2OY=LEquat.step(equationsW2OY,9);
	};
	
	this.OCN2WGS84 = function(ox,oy) {
		wx=this.paramO2WX.y*ox+this.paramO2WX.z*oy-this.paramO2WX.x;
		wy=this.paramO2WY.y*ox+this.paramO2WY.z*oy-this.paramO2WY.x;
		return {
			x : wx,
			y : wy
		};;
	};
	
	this.WGS842OCN = function(wx,wy) {
		ox=this.paramW2OX.y*wx+this.paramW2OX.z*wy-this.paramW2OX.x;
		oy=this.paramW2OY.y*wx+this.paramW2OY.z*wy-this.paramW2OY.x;
		return {
			x : ox,
			y : oy
		};;
	};
	this.caculatParam();
};
// 计算三元一次方程
// 确保常量和未知数分开在2边,逻辑安装这样处理的
var LEquat = {
  formatFloat: function(f, digit) {
    var m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
  },
  // 是否常量一边, 返回0常量的一边索引,1变量一边的索引，返回一个数组
  separateSide: function(equations) {
    var arr = [], equa = equations.split("=");
    if (equa[0].search(/x|y|z/) == -1) {
      arr = equa.slice(0);
    } else {
      arr[0] = equa[1];
      arr[1] = equa[0];
    }
    return arr;
  },
  // 分隔变量的一边，把x，y，z分隔
  // x 是索引0，y是索引1，z是索引2
  separateVariableSide: function(variableSide) {
    var variables = variableSide.split(/\s+(\+|\-)\s+/);
    var arr = [];
    for (var i = 0; i < variables.length; i++) {
      if (variables[i].search(/x/) != -1) {
        arr[0] = variables[i];
      } else if (variables[i].search(/y/) != -1) {
        arr[1] = variables[i];
      } else if (variables[i].search(/z/) != -1) {
        arr[2] = variables[i];
      }
    }
    return arr;
  },
  // 取出方程里面变量一边对应x，y，z的常量系数
  // 0: x的系数，1：y的系数，2：z的系数
  getCoefficient: function(variableSideArray) {
    var me = LEquat;
    var arr = [];
    for (var i = 0; i < variableSideArray.length; i++) {
      var coeffs = variableSideArray[i].split("*");
      if (coeffs[0].search(/x|y|z/) == -1) {
        arr[i] = coeffs[0];
      } else {
        arr[i] = coeffs[1];
      }
    }
    return arr;
  },
  step: function(equations,Acc) {
    var me = LEquat;
    // 分隔第一个方程
    var equation1 = me.separateSide(equations[0]);
    // 分隔第二个方程
    var equation2 = me.separateSide(equations[1]);
    // 分隔第三个方程
    var equation3 = me.separateSide(equations[2]);
    // 第一个方程的常量一边
    var a1 = equation1[0];
    // 第一个方程x系数
    var equa1 = me.getCoefficient(me.separateVariableSide(equation1[1]));
    // y的系数     z的系数     x的系数
    var b1 = equa1[1], c1 = equa1[2], d1 = equa1[0];
    // 第二个方程的常量一边
    var a2 = equation2[0];
    // 第二个方程变量一边系数
    var equa2 = me.getCoefficient(me.separateVariableSide(equation2[1]));
    var b2 = equa2[1], c2 = equa2[2], d2 = equa2[0];
    // 第三个方程的常量一边
    var a3 = equation3[0];
    // 第三个方程变量一边系数
    var equa3 = me.getCoefficient(me.separateVariableSide(equation3[1]));
    var b3 = equa3[1], c3 = equa3[2], d3 = equa3[0];
    var left4_1 = " ( " + a1 + " * ( " + d2 + " / " + d1 + " ) ) ";
    var right4_1 = " y " + " * " + b1 + " * ( " + d2 + " / " + d1 + " ) + z * " + c1 + " * ( " + d2 + " / " + d1 + " ) - " + d2 + " * x ";
    var left5_1 = " ( " + left4_1 + " - " + a2 + " ) ";
    var right5_1 = " y * ( ( " + b1 + " * ( " + d2 + " / " + d1 + " ) ) - " + b2 + " ) + z * ( ( " + c1 + " * ( " + d2 + " / " + d1 + " ) ) - " + c2 + " ) ";
    var left6_1 = " ( " + a1 + " * ( " + d3 + " / " + d1 + " ) ) ";
    var right6_1 = " y * ( " + b1 + " * ( " + d3 + " / " + d1 + " ) ) + z * ( " + c1 + " * ( " + d3 + " / " + d1 + " ) ) - " + d3 + " * x ";
    var left7_1 = " ( " + left6_1 + " - " + a3 + " ) ";
    var right7_1 = " y * ( ( " + b1 + " * ( " + d3 + " / " + d1 + " ) ) - " + b3 + " ) + z * ( ( " + c1 + " * ( " + d3 + " / " + d1 + " ) ) - " + c3 + " ) ";
    var left8_1 = " ( " + left5_1 + " * ( ( ( " + b1 + " * ( " + d3 + " / " + d1 + " ) ) - " + b3 + " ) / ( ( " + b1 + " * ( " + d2 + " / " + d1 + " ) ) - " + b2 + " ) ) ) ";
    var right8_1 = " y * ( ( " + b1 + " * ( " + d3 + " / " + d1 + " ) ) - " + b3 + " ) + z * ( ( ( " + c1 + " * ( " + d2 + " / " + d1 + " ) ) - " + c2 + " ) * ( ( ( " + b1 + " * ( " + d3 + " / " + d1 + " ) ) - " + b3 + " ) / ( ( " + b1 + " * ( " + d2 + " / " + d1 + " ) ) - " + b2 + " ) ) ) ";
    var left9_1 = " ( " + left8_1 + " - " + left7_1 + " ) ";
    var right9_1 = " z * ( ( ( ( " + c1 + " * ( " + d2 + " / " + d1 + " ) ) - " + c2 + " ) * ( ( ( " + b1 + " * ( " + d3 + " / " + d1 + " ) ) - " + b3 + " ) / ( ( " + b1 + " * ( " + d2 + " / " + d1 + " ) ) - " + b2 + " ) ) ) - ( ( " + c1 + " * ( " + d3 + " / " + d1 + " ) ) - " + c3 + " ) ) ";
    var z = left9_1 + " / " + " ( ( ( ( " + c1 + " * ( " + d2 + " / " + d1 + " ) ) - " + c2 + " ) * ( ( ( " + b1 + " * ( " + d3 + " / " + d1 + " ) ) - " + b3 + " ) / ( ( " + b1 + " * ( " + d2 + " / " + d1 + " ) ) - " + b2 + " ) ) ) - ( ( " + c1 + " * ( " + d3 + " / " + d1 + " ) ) - " + c3 + " ) ) ";
    var y = " ( " + left5_1 + " - " + " z * ( ( " + c1 + " * ( " + d2 + " / " + d1 + " ) ) - " + c2 + " ) ) " + " / " + " ( ( " + b1 + " * ( " + d2 + " / " + d1 + " ) ) - " + b2 + " ) ";
    y = y.replace("z", z);
    var x = " ( y * " + b1 + " + z * " + c1 + " - " + a1 + " ) / " + d1;
    x = x.replace("z", z).replace("y", y);
    x = me.formatFloat(eval(x), Acc);
    y = me.formatFloat(eval(y), Acc);
    z = me.formatFloat(eval(z), Acc);
    return {x: x,y: y,z: z};
  }
};

