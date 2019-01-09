/**
 * 3D地图
 * Created by jusfoun-fe.github.io on 2017/11/19.
 * @author 九次方前端研发部-朱润亚 <zhu18@vip.qq.com>
 * @version beta v1.0.3
 * @module Map3D
 */

import Detector from './Detector.js'
import * as THREE from './base.js'
import Font3D from './Font3D.js'
import TWEEN from './tween.min.js'
import Stats from './stats.js'


/**
 * 地图立体参数设置
 * @type {{amount: number, bevelThickness: number, bevelSize: number, bevelEnabled: boolean, bevelSegments: number, curveSegments: number, steps: number}}
 */
var extrudeOption = {
  amount : 2,
  bevelThickness : 1,
  bevelSize : .2,
  bevelEnabled : false,
  bevelSegments : 5,
  curveSegments :1,
  steps : 1,
};


/**
 * 创建3D地图.
 * @class
 * @example
 * //配置默认值
 * let opt={
 *      name:'',                // 调试使用，window['name']为该实例对象，注意设置debugger:true启用
 *      el:document.body,       // 容器
 *      geoData:null,           // 地图geojson数据
 *      hasStats:true,          // 是否显示性能面板
 *      hasControls:true,       // 用户是否能控制视角
 *      autoRotate:false,       // 是否自动旋转视角
 *      ambientColor:0x333333,  // 环境光颜色
 *      directionalColor:0xffffff,// 平行光颜色
 *      hasLoadEffect:false,    // 是否有加载效果
 *      debugger:false,         // 调试模式
 *      cameraPosition:{x:0,y:0,z:40},// 相机位置
 *      visualMap:null,         // 直观图图例
 *      extrude:extrudeOption,  // 立体厚度参数
 *
 *      area:{
 *          data:[],            // 地图用户数据[{ name:'北京', value:, color:0xff3333 }...]
 *          // area参数默认值
 *          name:'',            // 区域名称
 *          color:0x3366ff,     // 地图颜色
 *          hoverColor:0xff9933,// 鼠标移入颜色
 *          lineColor:0xffffff, // 线颜色
 *          opacity:1,          // 地图透明度
 *          hasPhong:true,      // 是否反光材质
 *          shininess:50,       // 反光材质光滑度
 *          hoverAnimaTime:100, // 鼠标移入动画过渡时间
 *          loadEffect:false,   // 区域加载效果
 *          hasHoverHeight:true,// 鼠标移入区域升高
 *      },
 *
 *      mark:{
 *          data:[],            // 标注点数据[{ name:'XXX', coord:[11,22], value:13 }...]
 *          // mark参数默认值
 *          name:'',            // 标注名称
 *          color:0xffffff,     // 标注点颜色
 *          hoverColor:0xff9933,// 鼠标移入颜色
 *          hoverAnimaTime:100, // 鼠标移入动画过渡时间
 *          min:0.01,
 *          max:5,
 *      },
 *
 *      line:{
 *          data:[],                        //线数据[{ fromName:'', toName:'', coords:[toCoord, fromCoord] }...]
 *          // line参数默认值
 *          color:0x55eeff,                 // 颜色
 *          hoverColor:0xff9933,            // 鼠标移入颜色
 *          hoverExclusive:true,            // 鼠标移入排除其他线条
 *          hoverAnimaTime:100,             // 鼠标移入动画过渡时间
 *          spaceHeight:5,                  // 曲线空间高度
 *          hasHalo:true,                   // 是否开启光晕效果
 *          hasHaloAnimate:true,            // 是否开启光晕动画效果
 *          haloDensity:2,                  // 光点密度 值越大 越浓密，越消耗性能
 *          haloRunRate:0.01,               // 光点运动频率
 *          haloColor:0xffffff,             // 默认继承color颜色[不建议修改]
 *          haloSize:10,                    // 光晕大小
 *          decayColor:0x222222,            // 未激活线条颜色
 *      },
 *
 *      //内置对象
 *      mapObject:null,     // 地图对象
 *      areaGroup:null,     // 区域组
 *      lineGroup:null,     // 线条组
 *      markGroup:null,     // 标记组
 *      scene:null,         // 场景对象
 *      camera:null,        // 相机对象
 *      renderer:null,      // 渲染器对象
 *      stats:null,         // 性能对象
 *      controls:null,      // 控制器对象
 *      _w:0,               // 呈现宽度
 *      _h:0,               // 呈现高度
 *      __event:null,        // 事件对象
 *  }
 *
 * let map = new JFE.visual.Map3D(opt);
 *
 * //事件注册
 *   map.addEventListener('mousedown', function (event) {
 *        let obj = event.target;
 *        if(obj.type==='Area') //type='Area|Line|Mark'
 *          obj.setColor('#ff6666', 500);
 *      });
 *
 *   map.addEventListener('mouseout', (event) => {
 *        let obj = event.target;
 *        console.log(obj.type+':out')
 *      });
 *
 *   map.addEventListener('mouseover', (event) => {
 *        let obj = event.target;
 *        console.log(obj.userData.name);
 *        //self.mapTitlePositon.left = $(window).scrollLeft() + event.clientX + 20 + 'px';
 *        //self.mapTitlePositon.top = $(window).scrollTop() + event.clientY + 20 + 'px';
 *      })
 *
 *   map.addEventListener('resize', function (event) {
 *        console.log('resize...');
 *      });
 */
class Map3D{
  constructor(o){
    if(!Detector.webgl) {
      console.warn('不支持webgl,停止渲染.');
      return;
    }
    let opt={
      name:'',            //调试使用，window['name']为该实例对象，注意设置debugger:true启用
      el:document.body,   //容器
      geoData:null,       //地图geojson数据
      hasStats:true,      //是否显示性能面板
      hasControls:true,   //用户是否能控制视角
      autoRotate:false,   //是否自动旋转视角
      ambientColor:0x333333,//环境光颜色
      directionalColor:0xffffff,//平行光颜色
      hasLoadEffect:false,//是否有加载效果
      debugger:false,     //调试模式
      cameraPosition:{x:0,y:0,z:40},//相机位置
      extrude:extrudeOption,//立体厚度参数

      area:{
        data:[],            //地图用户数据[{name:'北京',value:,color:0xff3333}...]
        //area参数默认值
        name:'',            // 区域名称
        color:0x3366ff,     //地图颜色
        hoverColor:0xff9933,//鼠标移入颜色
        lineColor:0xffffff, //线颜色
        opacity:1,          //地图透明度
        hasPhong:true,      //是否反光材质
        shininess:50,      //反光材质光滑度
        hoverAnimaTime:100, //鼠标移入动画过渡时间
        loadEffect:false,      //区域加载效果
        hasHoverHeight:true,  //鼠标移入区域升高
      },

      dataRange:{
        data:[],
        width:1,
        height:0.7,
        position:{x:23,y:-8,z:1},
        spacing:0.2,
        text:['高','低'],
        textColor:'#ffffff',
        showName:false,
        namePosition:{x:-2,y:0,z:0},
        hoverColor:0xff9933,
        hoverAnimaTime:100,
        hasHoverHeight:true,  //鼠标移入区域升高
        hasEvent:true,
      },

      mark:{
        data:[],          //标注点数据[{name:'XXX',coord:[11,22],value:13}...]
        // mark参数默认值
        name:'',             // 标注名称
        color:0xffffff,     //标注点颜色
        hoverColor:0xff9933,//鼠标移入颜色
        hoverAnimaTime:100, //鼠标移入动画过渡时间
        min:0.01,
        max:5,
      },
      line:{
        data:[],        //线数据[{fromName:'',toName:'',coords:[toCoord,fromCoord]}...]
        //line可继承参数
        color:0x55eeff,
        hoverColor:0xff9933,            // 鼠标移入颜色
        hoverExclusive:true,            // 鼠标移入排除其他线条
        hoverAnimaTime:100,             // 鼠标移入动画过渡时间
        spaceHeight:5,                  // 曲线空间高度
        hasHalo:true,                   // 是否开启光晕效果
        hasHaloAnimate:true,            // 是否开启光晕动画效果
        haloDensity:2,                  // 光点密度 值越大 越浓密，越消耗性能
        haloRunRate:0.01,               // 光点运动频率
        haloColor:0xffffff,             // 默认继承color颜色[不建议修改]
        haloSize:10,                    // 光晕大小
        decayColor:0x222222,            // 未激活线条颜色
      },


      //内置对象
      mapObject:null,//地图对象
      areaGroup:null,//区域组
      lineGroup:null,//线条组
      markGroup:null,//标记组
      scene:null,//场景对象-内部调用
      camera:null,//相机对象-内部调用
      renderer:null,//渲染器对象-内部调用
      stats:null,//性能对象-内部调用
      controls:null,//控制器对象-内部调用
      areaCount:0,
      _w:0,
      _h:0,
      __event:null,//事件对象
    }
    $.extend(true,opt,o);
    $.extend(true,this,opt);



    if(!this.geoData)
    {
      console.warn('Map3D no geoData.')
      return;
    }

    this._w=this.el.offsetWidth;
    this._h=this.el.offsetHeight;
    if(this._h<100) console.warn("map3D: Container height < 100px. It's not a good experience !!!")
    this.debugger && console.time('init');
    this.init()
    this.debugger && console.timeEnd('init');
    this.initEvent()
  }
  /**
   * 初始化方法
   */
  init(){
    this.el.innerHTML='';
    this.scene = new THREE.Scene({antialias:true});
    this.camera = new THREE.PerspectiveCamera(70, this._w/this._h, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer({alpha:true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);

    this.camera.lookAt(this.scene.position);
    this.renderer.setSize(this._w,this._h);

    this.scene.add(new THREE.AmbientLight(colorToHex(this.ambientColor)));
    this.dirLight = new THREE.DirectionalLight(colorToHex(this.directionalColor));
    this.dirLight.position.set(0,50,50);
    this.scene.add(this.dirLight);
    this.dirLightDown = new THREE.DirectionalLight(colorToHex(this.directionalColor));
    this.dirLightDown.position.set(0,-50,0);
    this.scene.add(this.dirLightDown);

    this.spotLight = new THREE.SpotLight(colorToHex(this.color));
    this.spotLight.position.set(0,150,150);
    this.spotLight.intensity = 0.7;
    this.spotLight.target = this.scene;
    this.scene.add(this.spotLight);

    //创建地图区域添加到 mapObject
    this.mapObject = new THREE.Group();

    this.initControls()
    this.initDebug();

    this.debugger && console.time('initArea');
    //初始化区域
    this.initArea();
    this.debugger && console.timeEnd('initArea');

    this.debugger && console.time('initMark');
    //初始化标注点
    this.initMark();
    this.debugger && console.timeEnd('initMark');

    this.debugger && console.time('initLine');
    //初始化线条
    this.initLine();
    this.debugger && console.timeEnd('initLine');

    this.debugger && console.time('inintDataRange');
    //初始化数据等级范围
    this.inintDataRange();
    this.debugger && console.timeEnd('inintDataRange');

    //根据数据中心位置偏移
    if(this.geoData.cp){
      this.mapObject.position.set(-this.geoData.cp[0],-this.geoData.cp[1],0);
    }
    this.scene.add(this.mapObject);
    this.scene.add(this.camera);
    this.el.appendChild(this.renderer.domElement);
    this.debugger && console.time('renderScene');
    this.renderScene();
    this.debugger && console.timeEnd('renderScene');
  }
  /**
   * 地图区域初始化方法 
   * - 初始化后区域都保存在 map.areaGroup.children 中
   * @param {json} areaOpt - 区域配置
   * @see {@link module:Map3D~Area}
   */
  initArea(areaOpt){
    Object.assign(this.area,areaOpt);
    Area.count=0;
    if(this.areaGroup)
    {
      this.areaGroup.remove(...this.areaGroup.children);
    }
    this.areaGroup = new THREE.Group();
    this.geoData.features.forEach((item)=>{
      //地图属性 & 用户属性合并
      let itemUserData = this.area.data.find(val=> val.name===item.properties.name );
      Object.assign(item.properties,itemUserData);
      this.createArea(item);
    })
    this.mapObject.add(this.areaGroup);
  }
 /**
   * 数据范围初始化方法 
   * - 初始化后数据范围都保存在 map.dataRangeGroup.children 中
   * @param {json} dataRangeOpt - 数据范围配置
   * @see {@link module:Map3D~DataRange}
   */
  inintDataRange(dataRangeOpt){
    Object.assign(this.dataRange,dataRangeOpt);
    //继承map立体高度
    let dataRangeOptClone = Object.assign({extrudeHeight:this.extrude.amount/2},this.dataRange);
    delete dataRangeOptClone.data;
    if(this.dataRangeGroup){
      this.dataRangeGroup.remove(...this.dataRangeGroup.children);
    }
    DataRange.count=0;

    this.dataRangeGroup  = new THREE.Group();

    this.dataRange.data.forEach((userData)=>{
      let opt=Object.assign({},dataRangeOptClone,userData);
      //数据范围创建
      let range = new DataRange(opt);
      //区域与范围关联
      range.rangeAreas=[];
      this.dataRangeGroup.add(range);

      //根据范围调整区域颜色显示
      let min = typeof userData.min==='undefined'?-999999999999:userData.min;
      let max = typeof userData.max==='undefined'?999999999999:userData.max;
      let tempArea=null;
      //区域与范围关联
      this.area.data.forEach((area)=>{
        if(typeof area.value !== 'undefined'){
          if(min<area.value && area.value < max)
          {
            tempArea=this.getArea(area.name);
            if(tempArea)
            {
              range.rangeAreas.push(tempArea);
              tempArea.setColor(userData.color)
            }
          }
        }

      })
    })

    //txt 设置
    if(this.dataRange.data.length>0)
    {
      if(this.dataRange.text[0]){
        let txt=Font3D.create(this.dataRange.text[0],{color:this.dataRange.textColor})
        txt.position.add({x:0,y:1,z:0})
        this.dataRangeGroup.add(txt);
      }
      if(this.dataRange.text[1]){
        let txt=Font3D.create(this.dataRange.text[1],{color:this.dataRange.textColor})
        txt.position.add({x:0,y:-(this.dataRange.height+DataRange.count * (this.dataRange.height + this.dataRange.spacing)),z:0})
        this.dataRangeGroup.add(txt);
      }
    }

    //调整整体位置
    this.dataRangeGroup.position.add(this.dataRange.position);
    this.scene.add(this.dataRangeGroup);
  }
  /**
   * 标注初始化方法
   * - 初始化后标注都保存在 map.markGroup.children 中
   * @param {json} markOpt - 标注配置
   * @see {@link module:Map3D~Mark}
   */
  initMark(markOpt){
    Object.assign(this.mark,markOpt);
    //继承map立体高度
    let markClone = Object.assign({extrudeHeight:this.extrude.amount},this.mark);
    delete markClone.data;
    Mark.count=0;
    if(this.markGroup)
    {
      this.markGroup.remove(...this.markGroup.children);
    }
    this.markGroup  = new THREE.Group();
    this.mark.data.forEach((userData)=>{
      let opt=Object.assign({},markClone,userData);
      let mark = new Mark(opt);
      this.markGroup.add(mark);
    })
    this.mapObject.add(this.markGroup);
  }


   /**
   * 线条初始化方法
   * - 初始化后标注都保存在 map.lineGroup.children 中
   * @param {json} lineOpt - 线条配置
   * @see {@link module:Map3D~Line}
   */
  initLine(lineOpt){
    Object.assign(this.line,lineOpt);
    let lineClone = Object.assign({extrudeHeight:this.extrude.amount},this.line);
    delete lineClone.data;
    Line.count=0;
    //重新生成所有线条
    if(this.lineGroup)
    {
      this.lineGroup.remove(...this.lineGroup.children);
    }
    this.lineGroup  = new THREE.Group();
    this.line.data.forEach((userData)=>{
      let opt=Object.assign({},lineClone,userData);
      let line = new Line(opt);
      this.lineGroup.add(line);
    })
    this.mapObject.add(this.lineGroup);

  }

  /**
   * 相机位置-现有位置追加
   * - 通过该方法实现视角转换动画
   * @param {v3} ps - 如：{x:0,y:0,y:2}
   * @param {number} [time] - 动画时间
   * @param {int} [delay=0] - 延时
   * @example
   * //镜头拉近z:-10,地图放大,1000ms动画
   * map.addCameraPosition({z:-10},1000)
   */
  addCameraPosition(v3,time,delay,callback){
    let v=new THREE.Vector3(v3.x,v3.y,v3.z);
    if(typeof time ==='number'){
      let to = this.camera.position.clone().add(v);
      if(!callback)callback=()=>{}
      new TWEEN.Tween(this.camera.position).to(to,time).delay(delay||0).start().onComplete(callback);
    }
    else
      this.camera.position.add(v3.x,v3.y,v3.z);
  }
  /**
   * 相机位置-新位置设置
   * @param {v3} ps - 如：{x:0,y:0,y:2}
   * @param {number} [time] - 动画时间
   * @param {int} [delay=0] - 延时
   */
  setCameraPosition(v3,time,delay,callback){
    if(time && typeof time==='number')
      Map3D.transition(this.camera.position,v3,time,delay,callback);
    else
      this.camera.position.set(v3.x,v3.y,v3.z);
  }

  /**
   * 销毁地图对象
   */
  dispose(){
    this.el.innerHTML='';
    this.__event.dispose();
  }
  /**
   * 禁用
   * @param {boolean} disable - 是否禁用
   */
  disable(disable){
    disable=typeof disable==='undefined'?true:disable;
    if(disable){
      this.el.style.pointerEvents='none';
      this.__event.enable=!disable;
    }
    else
    {
      this.el.style.pointerEvents='';
      this.__event.enable=!disable;
    }
  }

  /**
   * 初始化地图事件
   * @private
   */
  initEvent(){
    this.__event=new THREE.Event(this);
  }

  /**
   * 初始化控制器,返回{@link https://threejs.org/docs/#examples/controls/OrbitControls|THREE.OrbitControls}
   * @returns {THREE.OrbitControls}
   */
  initControls(){
    if(!this.hasControls)return
    this.controls = new THREE.OrbitControls(this.camera,this.renderer.domElement);
    this.controls.userPan=false;
    this.controls.autoRotate=this.autoRotate;
    this.controls.userPanSpeed=1;
    return this.controls;
  }

  /**
   * 初始化性能监控器 - debugger:true 自动开启，返回{@link https://github.com/mrdoob/stats.js|stats}
   * @returns {Stats}
   */
  initStats(){
    this.stats = new Stats();
    this.stats.setMode(0);//0:fps |1:ms
    this.stats.domElement.style.position='absolute';
    this.stats.domElement.style.top='70px';
    this.stats.domElement.style.right='0px';
    this.el.appendChild(this.stats.domElement);
    return this.stats;
  }

  /**
   * 初始化调试模式
   * - 开启性能监控面板
   * - 显示地平线、xyz轴线、灯光辅助线、相机位置、地图全局命名变量(需要先设置name属性)
   * @example
   * 
   * new JFE.visual.Map3D({debugger:true})//开启调试模式
   */
  initDebug(){
    if(!this.debugger) return
    if(this.name){
      window[this.name]=this;
    }
    this.initStats();
    let helper = new THREE.DirectionalLightHelper( this.dirLight, 5 );
    this.scene.add( helper );
    let spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
    this.scene.add( spotLightHelper );
    let size = 300;
    let divisions = 40;
    let gridHelper = new THREE.GridHelper( size, divisions );
    this.scene.add( gridHelper );
    let axisHelper = new THREE.AxisHelper( 50 );
    this.scene.add( axisHelper );

    this.infoPlane = document.createElement('div');
    this.infoPlane.contentEditable=true;
    this.infoPlane.style.position='absolute';
    this.infoPlane.style.bottom='70px';
    this.infoPlane.style.right='10px';
    this.infoPlane.style.padding ='5px 10px';
    this.infoPlane.style.background ='rbga(0,0,0,.5)';
    this.infoPlane.style.border ='1px solid #aaa';
    this.infoPlane.style.borderRadius='5px';
    this.infoPlane.style.color='#eee';
    this.el.appendChild(this.infoPlane);
  }
  /**
   * 打印相机位置在屏幕，需要开启debugger模式
   */
  printCameraPosition(){
    let v3=this.camera.position;
    this.infoPlane.textContent='相机位置 {x:'+v3.x.toFixed(4)+",y:"+v3.y.toFixed(4)+",z:"+v3.z.toFixed(4)+'}';
  }

  /**
   * 删除区域
   * @param {string|Area} area - 要删除的区域名称或者区域对象 {@link module:Map3D~Area|Area}
   */
  reomveArea(area){
    if(typeof area === 'string')
      area=this.getArea(area);
    this.areaGroup.remove(area);
  }

  /**
   * 删除标注
   * @param {string|Mark} mark - 要删除的标注名称或者标注对象 {@link module:Map3D~Mark|Mark}
   */
  removeMark(mark){
    if(typeof mark === 'string')
      mark=this.getMark(mark);
    this.markGroup.remove(mark);
  }
  /**
   * 得到地图区域
   * @param {string} areaName - 地图区域名称  {@link module:Map3D~Area|Area}
   * @returns {Area}
   */
  getArea(areaName){
    return this.areaGroup.getObjectByName(areaName);
  }
  /**
   * 得到地图标注
   * @param {string} markName - 地图标注名称 {@link module:Map3D~Mark|Mark}
   * @returns {Mark}
   */
  getMark(markName){
    return this.markGroup.getObjectByName(areaName);
  }

  /**
   * 通过name得到地图相关对象集合 {@link https://threejs.org/docs/#api/core/Object3D|THREE.Object3D}[]
   * @param {string} name - 对象名称 
   * @returns {Array}
   */
  getObjectsByName(name){
    let objects=[];
    this.scene.traverse((obj)=>{
      if(obj.name===name){
        objects.push(obj);
      }
    })
    return objects;
  }

  /**
   * 地图呈现
   * @protected
   */
  renderScene(){
    this.renderer.clear();
    requestAnimationFrame(this.renderScene.bind(this));

    // this.pos=this.pos||0;
    // let light = this.scene.getObjectByName('pointLight');
    // let p = this.scene.getObjectByName('point');
    // if(this.pos < 1){
    //   let v3=this.curve.getPointAt(this.pos);
    //   light.position.set(v3.x,v3.y,v3.z);
    //   p.position.set(v3.x,v3.y,v3.z);
    //     this.pos += 0.001
    // }else{
    //   this.pos = 0;
    // }
    this.lineGroup.children.map((line)=>{
      if(line.halo)
        line.halo.update();
    })

    this.markGroup.children.map((mark)=>{
      mark.update();
    })

    TWEEN.update();

    if(this.hasControls)
      this.controls.update();

    if(this.debugger){
      this.stats.update();
      this.printCameraPosition();
    }

    this.renderer.render(this.scene, this.camera);

  }

  /**
   * 地图大小改变时事件
   * @private
   */
  _onResize(){
    this.dispatchEvent({ type: 'resize', el:null});
  }

  /**
   *
   * 鼠标移动时触发
   * @param event
   * @param intersects
   * @private
   */
  _onMouseMove(event,intersects){
    if ( intersects.length > 0 ) {
      //之前选中对象ID
      let preSelectedObjID=this.selectedObj?this.selectedObj.id:'';
      this.selectedObj=null;

      for(let i=0;i<intersects.length;i++){
        if(intersects[i].object && intersects[i].object.type==='Mesh' && intersects[i].object.parent.type && intersects[i].object.parent.type==='Area')
        {
          this.selectedObj=intersects[ i ].object.parent;
          break;
        }
        else if(intersects[i].object && intersects[i].object.type==='Mark')
        {
          this.selectedObj=intersects[ i ].object;
          break;
        }
        else if(intersects[i].object && intersects[i].object.parent == this.lineGroup && intersects[i].object.type==='Line')
        {
          this.selectedObj=intersects[ i ].object;
          break;
        }
        else if(intersects[i].object && intersects[i].object.parent && intersects[i].object.parent.type==='DataRange')
        {
          this.selectedObj=intersects[ i ].object.parent;
          break;
        }
      }
      /* 选中区域元素 */
      //已选中对象
      if(this.selectedObj)
      {
        //如果不是同一个对象
        if(preSelectedObjID!=this.selectedObj.id)
        {
          //老对象触发mouseout
          if(preSelectedObjID){
            let preSelectedObj=this.scene.getObjectById(preSelectedObjID);
            //移出区域还原
            if(preSelectedObj)
              preSelectedObj.onmouseout(this, event);
          }
          //新对象触发mouseover
          this.selectedObj.onmouseover(this, event);
        }
      }
      else{
        //未选中对象,老对象触发mouseout
        if(preSelectedObjID){
          let preSelectedObj=this.scene.getObjectById(preSelectedObjID);
          //移出区域还原
          if(preSelectedObj)
            preSelectedObj.onmouseout(this, event);
        }
      }

    } else {
      /* 没有选中任何对象，还原已选中元素 */
      if(this.selectedObj){
        //移出区域还原
        this.selectedObj.onmouseout(this, event);
      }
      this.selectedObj=null
    }
  }

  /**
   * 鼠标单击触发
   * @param event
   * @param intersects
   * @private
   */
  _onMouseDown(event,intersects){

    if ( intersects.length > 0 ) {
      let selectedObj=null;
      for(let i=0;i<intersects.length;i++){
        if(intersects[i].object && intersects[i].object.type=='Mesh' && intersects[i].object.parent.type && intersects[i].object.parent.type=='Area')
        {
          selectedObj=intersects[ i ].object.parent;
          break;
        }
        else if(intersects[i].object && intersects[i].object.type==='Mark')
        {
          selectedObj=intersects[ i ].object;
          break;
        }
        else if(intersects[i].object && intersects[i].object.parent && intersects[i].object.parent.type==='DataRange')
        {
          selectedObj=intersects[ i ].object.parent;
          break;
        }
      }
      if(selectedObj)
      {
        this.debugger && console.log(selectedObj)
        selectedObj.onmousedown(this,event)
      }
    }
  }
  //创建地图区域块
  //结构 parentObj:[area1,area2...]
  /**
   * 创建区域
   * @param {Object} item
   * @param {string} [item.name=''] - 区域名称
   * @param {color} [item.color=0x3366ff] - 区域颜色
   * @param {color} [item.hoverColor=0xff9933] - 区域鼠标选中颜色
   * @param {number} [item.opacity=1] - 区域透明度
   * @param {boolean} [item.hasPhong=true] - 是否反光材质
   * @param {number} [item.shininess=50] - 反光材质光滑度
   * @param {number} [item.hoverAnimaTime=100] - 鼠标移入动画过渡时间
   * @param {number} [item.loadEffect=false] - 区域加载效果
   * @param {boolean} [item.hasHoverHeight=true] - 鼠标移入区域升高
   */
  createArea(item){
    // item.properties 一般有{id,name,cp,childNum,color,value,extrude}
    // Area继承Map3D属性
    let pros=Object.assign({
      color:this.area.color,           //地图颜色
      hoverColor:this.area.hoverColor, //鼠标移入颜色
      lineColor:this.area.lineColor,   //线颜色
      opacity:this.area.opacity,        //地图透明度
      hasPhong:this.area.hasPhong,      //是否反光材质
      shininess:this.area.shininess,    //反光材质光滑度
      hoverAnimaTime:this.area.hoverAnimaTime, //鼠标移入动画过渡时间
      extrude:this.extrude,             //立体厚度参数
      loadEffect:this.area.loadEffect,  //加载效果
      hasHoverHeight:this.area.hasHoverHeight    //有标注，选中区域不升高
    },item.properties)

    let coords=[];
    if(item.geometry.type=='Polygon'){
      coords.push(item.geometry.coordinates[0]);
    }
    else if (item.geometry.type=='MultiPolygon') {
      for(var i=0;i<item.geometry.coordinates.length;i++){
        coords.push(item.geometry.coordinates[i][0]);
      }
    }
    pros.coords=coords;
    let area=new Area(pros);
    this.areaGroup.add(area);
  }


  /**
   * 过渡动画
   * @param {Object|*} from - 修改的启始值
   * @param {Object|*} to - 修改的结束值
   * @param {number} [time] - 完成时间
   * @param {number} [delay=0] - 延迟时间
   * @param {callback} [callback] - 完成回调
   * @example
   * JFE.visual.Map3D.transition(area.position, {x:0,y:0,z:10}, 1000)
   */
  static transition(from,to,time,delay,callback){
    if(typeof time !=='number'){
      time=1000;
    }
    if(!callback)callback=()=>{};
    new TWEEN.Tween(from).to(to,time).delay(delay||0).start().onComplete(callback);
  }


}

/**
 * 重写three自定义事件
 */
Object.assign(THREE.EventDispatcher.prototype,{dispatchEvent: function ( event) {
  if ( this._listeners === undefined ) return;
  var listeners = this._listeners;
  var listenerArray = listeners[ event.type ];
  if ( listenerArray !== undefined ) {
    //Object.assign(event, event.orgEvent);
    let target=event.target;
    //通过原始事件构造自定义事件
    for(let a in event.orgEvent)
      event[a] = event.orgEvent[a];
    //覆盖原始事件目标对象
    event.target = target||this;
    var array = listenerArray.slice( 0 );
    for ( var i = 0, l = array.length; i < l; i ++ ) {
      array[ i ].call( this, event );
    }
  }
}})
Object.assign( Map3D.prototype, THREE.EventDispatcher.prototype );

/**
 * 数据区域
 * @class
 * @extends THREE.Mesh
 */
class DataRange extends THREE.Object3D{
  constructor(pros){
    super(pros)
    this.type="DataRange";
    this.name=pros.name;
    Object.assign(this.userData,pros);
    let boxGeo = new THREE.BoxGeometry(pros.width,pros.height,pros.extrudeHeight);
    let boxMate = new THREE.MeshPhongMaterial({color:pros.color});
    let range = new THREE.Mesh(boxGeo,boxMate);

    this.position.y = this.position.y - DataRange.count * (pros.height + pros.spacing);
    if(pros.showName){
      let txt = Font3D.create(pros.name,{color:'#ffffff'});
      txt.position.copy(range.position)
      txt.position.y = txt.position.y - 0.3;
      txt.position.add(pros.namePosition)
      this.add(txt);
      this.txt=txt;
    }

    this.mesh=range;
    this.add(range);
    DataRange.count++;
  }

  /**
   * 选中并返回其关联区域
   * @returns {Area[]}
   */
  select(){
    return this.rangeAreas.map((area)=>{
      area.setColor(this.userData.hoverColor);
      if(area.userData.hasHoverHeight) {
        new TWEEN.Tween(area.position).to({z:area.userData.extrude.amount/2}, area.userData.hoverAnimaTime).start();
      }
    })
  }

  /**
   * 取消选中状态
   */
  unselect(){
    this.rangeAreas.map((area)=>{
      area.setColor(this.userData.color);
        if(area.userData.hasHoverHeight) {
          new TWEEN.Tween(area.position).to({z:0}, area.userData.hoverAnimaTime).start();
        }
    })
  }
  /**
   * 鼠标移出
   * @param {*} dispatcher 
   * @param {*} event 
   */
  onmouseout(dispatcher,event){
    this.unselect();
    new TWEEN.Tween(this.mesh.material.color).to(new THREE.Color(colorToHex(this.userData.color)), this.userData.hoverAnimaTime).start();
    if(!this.userData.hasEvent)return
    dispatcher.dispatchEvent({ type: 'mouseout', target:this, orgEvent:event});
  }
  /**
   * 鼠标移入
   * @param {*} dispatcher 
   * @param {*} event 
   */
  onmouseover(dispatcher,event){
    this.select();
    new TWEEN.Tween(this.mesh.material.color).to(new THREE.Color(colorToHex(this.userData.hoverColor)), this.userData.hoverAnimaTime).start();
    if(!this.userData.hasEvent)return
    dispatcher.dispatchEvent({ type: 'mouseover', target:this, orgEvent:event});
  }
  /**
   * 鼠标单击
   * @param {*} dispatcher 
   * @param {*} event 
   */
  onmousedown(dispatcher,event){
    if(!this.userData.hasEvent)return
    dispatcher.dispatchEvent({ type: 'mousedown', target:this, orgEvent:event});
  }
}
/**
 * 数据范围数量
 * @static
 * @type {number}
 */
DataRange.count=0;

/**
 * 地图区域,继承{@link https://threejs.org/docs/#api/core/Object3D|THREE.Object3D}
 * @class
 * @extends THREE.Object3D
 * @example
 *
 *  let opt = {
 *     color:0x3366ff,     //地图颜色
 *     hoverColor:0xff9933,//鼠标移入颜色
 *     lineColor:0xffffff, //线颜色
 *     opacity:1,          //地图透明度
 *     hasPhong:true,      //是否反光材质
 *     shininess:50,       //反光材质光滑度
 *     hoverAnimaTime:100, //鼠标移入动画过渡时间
 *     loadEffect:false,      //区域加载效果
 *     hasHoverHeight:true,  //鼠标移入区域升高
 *  }
 *  // 创建一个区域
 *  let area = new Area(opt);
 *  // map 初始化以后可以获取
 *  let area = map.areaGroup.getObjectByName('北京')
 */
class Area extends THREE.Object3D{
  /**
   * 构造函数
   * @param pros
   */
  constructor(pros){
    //调用实现父类的构造函数
    super(pros);
    this.type="Area";
    this.name=pros.name;
    Object.assign(this.userData,pros);
    let coords = pros.coords;
    this._mesh = this.getMesh(coords,pros);
    this._line = this.getLine(coords,pros);

    this.add(this._mesh);
    this.add(this._line);


    // 文字添加 待完善
    // let tg=new THREE.Group();
    // tg.name=this.name+'_text';
    // tg.position.z=0.01;
    // this._text = Font3D.create(this.name,{size:30,color:'#333333'});
    // this._text.position.z=2.01;
    // tg.add(this._text)
    // this.add(tg);


    if(pros.loadEffect){
      this.setPosition({x:0,y:0,z:-100});
      this.setPosition({x:0,y:0,z:0}, 100, Area.count*10);
    }
    Area.count++;
  }

  /**
   * 创建立体块
   * @param {array} coords -  坐标经纬度，如：[112,22]
   * @param {object} pros - 区域初始化属性
   * @returns {*}
   * @protected
   */
  getMesh(coords,pros){
    if(!coords)return;
    try{
      let geo=new THREE.Geometry();
      coords.forEach((coord)=>{
        let pts=this.getGeoPoints(coord);
        let g=this.getExtrudeGeometry(pts);
        geo.merge(g, g.matrix);
      })

      return this.getGeoMesh(geo,pros);
    }catch(e)
    {
      console.warn("Area.getMesh:"+e.message);
    }
  }

  /**
   * 创建块的边缘线
   * @param {array} coords -  坐标经纬度，如：[112,22]
   * @param {object} pros - 区域初始化属性
   * @returns {THREE.Group}
   */
  getLine(coords,pros){
    if(!coords)return;

    //mate
    let material = new THREE.LineBasicMaterial({
      opacity: 1.0,
      linewidth: 2,
      polygonOffset:true,polygonOffsetFactor:1,
      color:this.userData.lineColor
    });

    //geo
    let lines = new THREE.Group();
    coords.forEach((coord)=>{
      let pts=this.getGeoPoints(coord);
      let line = new THREE.Geometry();
      for(let i=0,l=pts.length;i<l;i++){
        line.vertices.push(new THREE.Vector3(pts[i].x,pts[i].y,this.userData.extrude.amount + this.userData.extrude.amount/100));
      }

      let lineMesh=new THREE.Line(line, material);

      lines.add(lineMesh);
    });

    return lines;
  }

  /**
   * 得到顶点数据
   * @param coord
   * @returns {Array}
   * @protected
   */
  getGeoPoints(coord){
    try{
      let pts=[];
      for(let i=0,l=coord.length;i<l;i++){
        pts.push(new THREE.Vector2(coord[i][0],coord[i][1]));
      }
      return pts;
    }catch(e)
    {
      console.log('getGeoPoints:parse coord error:'+JSON.stringify(coord));
    }
  }

  /**
   * 拉伸块高度
   * @param {array} pts - 顶点数组
   * @returns {THREE.ExtrudeGeometry}
   * @protected
   */
  getExtrudeGeometry(pts){
    let shape = new THREE.Shape(pts);
    let extrude =Object.assign({},this.userData.extrude);
    let geo = new THREE.ExtrudeGeometry(shape, extrude);
    return geo;
  }

  /**
   * 拉伸块高度
   * @param geo
   * @param pros
   * @returns {*}
   */
  getGeoMesh(geo,pros){
    let mateOption={};
    mateOption.color = pros.color!=null ? colorToHex(pros.color) : Math.random() * 0xffffff;
    mateOption.shininess= pros.shininess || 100;
    mateOption.transparent= true;
    mateOption.opacity = (typeof pros.opacity === 'undefined') ? this.userData.opacity : pros.opacity;

    let geoMesh=null;
    if(this.userData.hasPhong)
      geoMesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial(mateOption));
    else
      geoMesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial(mateOption));
    //var geoMesh = THREE.SceneUtils.createMultiMaterialObject(geo,[new THREE.MeshPhongMaterial(mateOption),new THREE.MeshBasicMaterial({wireframe:true,color:0xffffff,transparent:true,opacity:0.35})])
    return geoMesh;
  }

  /**
   * Area的网格对象
   * @returns {HTREE.Mesh}
   */
  get mesh(){
    return this._mesh;
  }

  /**
   * Area的边缘线对象
   * @returns {THREE.Group}
   */
  get line(){
    return this._line;
  }

  /**
   * 设置区域颜色
   * @param {color} color - 格式 0xff9933,'#ff9933','rgb(255,160,50)','hsl(340,100%,50%)'
   * @param {number} [time] - 动画完成时间,与transition时间类似
   * @param {number} [delay=0] - 动画延迟时间
   * @param {callback} [callback] - 动画完成后回调
   * @example
   * 
   * area.setColor(0xff3333,1000)
   */
  setColor(color,time,delay,callback){
    this.userData.color=colorToHex(color);
    if(time && typeof time==='number'){
      color=new THREE.Color(colorToHex(color));
      Map3D.transition(this.mesh.material.color,color,time,delay,callback);
    }
    else {
      this.mesh.material.color.set(colorToHex(color));
    }
  }

  /**
   * 设置区域位置
   * @param {v3} v3 - 格式{x:0,y:0,z:0}
   * @param {number} [time] - 动画完成时间,与transition时间类似
   * @param {number} [delay=0] - 动画延迟时间
   * @param {callback} [callback] - 动画完成后回调
   */
  setPosition(v3,time,delay,callback){
    if(time && typeof time==='number')
      Map3D.transition(this.position,v3,time,delay,callback);
    else
      this.position.set(v3.x,v3.y,v3.z);
  }
  /**
   * 设置区域旋转
   * @param {v3} v3 - 格式{x:0,y:0,z:0}
   * @param {number} [time] - 动画完成时间,与transition时间类似
   * @param {number} [delay=0] - 动画延迟时间
   * @param {callback} [callback] - 动画完成后回调
   */
  setRotation(v3,time,delay,callback){
    v3.x=v3.x * (Math.PI / 180)
    v3.y=v3.y * (Math.PI / 180)
    v3.z=v3.z * (Math.PI / 180)
    Map3D.transition(this.rotation,v3,time,delay,callback);
  }
  /**
   * 设置区域大小
   * @param {v3} v3 - 格式{x:0,y:0,z:0}
   * @param {number} [time] - 动画完成时间,与transition时间类似
   * @param {number} [delay=0] - 动画延迟时间
   * @param {callback} [callback] - 动画完成后回调
   */
  setScale(v3,time,delay,callback){
    if(time && typeof time==='number')
      Map3D.transition(this.scale,v3,time,delay,callback);
    else
      this.scale.set(v3.x,v3.y,v3.z);
  }

  /**
   * 鼠标移出事件
   * @param dispatcher
   * @param event
   * @example
   *
   * map.addEventListener('mouseout', (event) => {
     *    let obj = event.target;
     *    console.log(obj.type+':out')
     *  });
   */
  onmouseout(dispatcher,event){
    if(this.userData.hasHoverHeight)
      new TWEEN.Tween( this.position ).to({z: 0,}, this.userData.hoverAnimaTime).start()
    new TWEEN.Tween(this.mesh.material.color).to(new THREE.Color(colorToHex(this.userData.color)), this.userData.hoverAnimaTime).start();
    dispatcher.dispatchEvent({ type: 'mouseout', target:this, orgEvent:event});

  }
  /**
   * 鼠标移入事件
   * @param dispatcher
   * @param event
   * @example
   *
   * map.addEventListener('mouseover', (event) => {
     *    let obj = event.target;
     *    console.log(obj.type+':over')
     *  });
   */
  onmouseover(dispatcher,event){
    //区域移入高度
    //this.selectedArea.position.z=1;
    if(this.userData.hasHoverHeight)
      new TWEEN.Tween( this.position ).to({z: this.userData.extrude.amount/2,}, this.userData.hoverAnimaTime).start();
    //区域移入颜色
    new TWEEN.Tween(this.mesh.material.color).to(new THREE.Color(colorToHex(this.userData.hoverColor)), this.userData.hoverAnimaTime).start();
    dispatcher.dispatchEvent({ type: 'mouseover', target:this, orgEvent:event});
  }
  /**
   * 鼠标单击事件
   * @param dispatcher
   * @param event
   * @example
   *
   * map.addEventListener('mousedown', (event) => {
     *    let obj = event.target;
     *    console.log(obj.type+':click')
     *  });
   */
  onmousedown(dispatcher,event) {
    dispatcher.dispatchEvent({ type: 'mousedown', target:this, orgEvent:event});
  }
}
/**
 * 区域数量
 * @static
 * @type {number}
 */
Area.count=0;
/**
 * 地图标注,继承{@link https://threejs.org/docs/#api/objects/Sprite|THREE.Sprite}
 * @class
 * @extends THREE.Sprite
 * @example
 *
 * let opt={
 *  name:'台风-依安',
 *  coord:[116,23],
 *  color:0xff0000,
 *  size:4,
 *  value:2,
 *  userAttrA:'A'
 * }
 * let mark = new Mark(opt);
 * console.log(mark.userData.value +  mark.userData.userAttrA)  //'2A'
 */
class Mark extends THREE.Sprite{
  /**
   * 光点纹理样式,返回一个纹理 {@link https://threejs.org/docs/#api/textures/Texture|THREE.Texture}
   * @returns {THREE.Texture}
   * @example
   * Mark.texture()
   */
  static get texture(){
    if(!Mark._texture)
    {
      let canvas = document.createElement("canvas");
      canvas.width=128;
      canvas.height=128;
      let context = canvas.getContext('2d');
      Mark.draw(context);
      let texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      Mark._texture=texture;
    }
    return Mark._texture;
  }
  /**
   * 光点纹理样式,如果你对canvas熟悉可以重写.否则使用默认样式
   * @static
   * @param {context} context - Canvas上下文对象 {@link https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext|Canvas.context}
   * @example
   *
   * Mark.draw=(ctx)=>{
     *  context.clearRect(0, 0, 128, 128);
     *  context.fillStyle = '#ff0000';
     *  context.arc(64, 64, 20, 0, Math.PI * 2, false);
     *  context.fill();
     * }
   */
  static draw(context,v){
    v=v||1;
    context.clearRect(0, 0, 128, 128);
    context.fillStyle = '#ffffff';
    context.arc(64, 64, 20, 0, Math.PI * 2, false);
    context.fill();

    context.fillStyle = 'rgba(255,255,255,.5)';
    context.arc(64, 64, 60*v, 0, Math.PI * 2, false);
    context.fill();

    // context.fillStyle = 'rgba(0,0,0,.5)';
    // context.rect(0, 0, 128, 128, Math.PI * 2, false);
    // context.fill();
  }

  /**
   * 创建一个标注
   * @param {Object} pros - The mark options | 标注的配置
   * @param {string} [pros.name=''] - mark name | 标注名称
   * @param {array} pros.coord - mark coord | 标注坐标,如:[112,33]
   * @param {string} [pros.color=0xffffff] - mark color | 标注颜色
   * @param {string} [pros.hoverColor=0xff9933] - mark hoverColor | 标注的鼠标移入颜色
   * @param {number} [pros.hoverAnimaTime=100] - mark hover Animate time | 鼠标移入动画过渡时间
   * @param {string} [pros.value=''] - mark value | 标注值
   * @param {*} [pros.*] - User extended attributes | 用户扩展属性
   *
   */
  constructor(pros){
    super();
    this.material = new THREE.SpriteMaterial( { map: Mark.texture, color: pros.color } );
    this.type="Mark";
    this.name=pros.name;
    Object.assign(this.userData,pros);

    let size=pros.size||this.userData.min;
    size=size<this.userData.min?this.userData.min:size;
    size=size>this.userData.max?this.userData.max:size;
    this.userData.size=size;
    this.scale.set(size, size, 1);
    //console.log(size);
    this.position.x=pros.coord[0];
    this.position.y=pros.coord[1];
    this.position.z=2+size*35/100;

    this.update = function(){
      // if(!line.userData.hasHalo || !line.userData.hasHaloAnimate)
      //   return;

      let time = Date.now() * 0.005 ;
      let size = Math.abs(Math.sin(0.1+time))
      // new TWEEN.Tween(this.scale).to({x:size,y:size},100).delay(Mark.count*10).start()

      // let context = this.material.map.image.getContext('2d');
      // Mark.draw(context,size);
      // this.material.map.needsUpdate = true;

      // let geometry = this.geometry;
      // let attributes = geometry.attributes;
      // for ( let i = 0; i < attributes.size.array.length; i++ ) {
      //   attributes.size.array[ i ] = size + size * Math.sin( 0.1 * i + time );
      // }
      // attributes.size.needsUpdate = true;
    }

    Mark.count++;
  }

  /**
   * 设置标注颜色
   * @param {color} color - 颜色格式0xff9933,'#ff9933','rgb(255,255,255)','hsl(100,100%,50%)'
   * @param {number} [time] - 动画完成时间,与transition时间类似
   * @param {number} [delay=0] - 动画延迟时间
   * @param {callback} [callback] - 动画完成后回调
   * @example
   *  map.addEventListener('mouseover', (event) => {
     *    let obj = event.target;
     *    if(obj.type==='Mark')
     *    {
     *      obj.setColor('#ff5555',100);// 鼠标移入设置为红色
     *    }
     *  });
   */
  setColor(color, time, delay, callback){
    this.userData.color=colorToHex(color);
    if(time && typeof time==='number'){
      color=new THREE.Color(colorToHex(color));
      Map3D.transition(this.material.color,color,time,delay,callback);
    }
    else {
      this.material.color.set(colorToHex(color));
    }
  }

  /**
   * 设置标注位置
   * @param {v3} v3 - 格式{x:11,y:33,z:2}
   * @param {number} [time] - 动画完成时间,与transition时间类似
   * @param {number} [delay=0] - 动画延迟时间
   * @param {callback} [callback] - 动画完成后回调
   * @example
   *
   * map.addEventListener('mouseover', (event) => {
     *     let obj = event.target;
     *     if(obj.type==='Mark')
     *     {
     *       obj.setPosition({x:0,y:0,z:4},300) //标注升高
     *     }
     *   });
   *
   */
  setPosition(v3,time,delay,callback){
    if(time && typeof time==='number')
      Map3D.transition(this.position,v3,time,delay,callback);
    else
      this.position.set(v3.x,v3.y,v3.z);
  }

  /**
   * 设置标注旋转
   * @param {v3} v3 - 格式{x:11,y:33,z:2}
   * @param {number} [time] - 动画完成时间,与transition时间类似
   * @param {number} [delay=0] - 动画延迟时间
   * @param {callback} [callback] - 动画完成后回调
   */
  setRotation(v3,time,delay,callback){
    v3.x=v3.x * (Math.PI / 180)
    v3.y=v3.y * (Math.PI / 180)
    v3.z=v3.z * (Math.PI / 180)
    Map3D.transition(this.rotation,v3,time,delay,callback);
  }
  /**
   * 设置标注大小
   * @param {v3} v3 - 格式{x:11,y:33,z:2}
   * @param {number} [time] - 动画完成时间,与transition时间类似
   * @param {number} [delay=0] - 动画延迟时间
   * @param {callback} [callback] - 动画完成后回调
   */
  setScale(v3,time,delay,callback){
    if(time && typeof time==='number')
      Map3D.transition(this.scale,v3,time,delay,callback);
    else
      this.scale.set(v3.x,v3.y,v3.z);
  }
  /* 事件 */
  onmouseout(dispatcher,event){
    let size=this.userData.size*1
    new TWEEN.Tween(this.scale).to({x:size,y:size}, this.userData.hoverAnimaTime).start();
    new TWEEN.Tween(this.material.color).to(new THREE.Color(colorToHex(this.userData.color)), this.userData.hoverAnimaTime).start();
    dispatcher.dispatchEvent({ type: 'mouseout', target:this, orgEvent:event});

  }
  onmouseover(dispatcher,event){
    let size=this.userData.size*1.5
    new TWEEN.Tween(this.scale).to({x:size,y:size}, this.userData.hoverAnimaTime).start();
    //区域移入颜色
    new TWEEN.Tween(this.material.color).to(new THREE.Color(colorToHex(this.userData.hoverColor)), this.userData.hoverAnimaTime).start();
    dispatcher.dispatchEvent({ type: 'mouseover', target:this, orgEvent:event});
  }
  onmousedown(dispatcher,event) {
    dispatcher.dispatchEvent({ type: 'mousedown', target:this, orgEvent:event});
  }
}
/**
 * 所有标注数量,静态属性
 * @type {number}
 * @example
 * //查看地图所有标注数
 * console.log(Mark.count);
 */
Mark.count=0;
Mark._texture=null;
/** Class representing a Line.
 * @extends THREE.Line
 *
 * @example
 * var opt={
 *   color:0x55eeff,                 // 基线颜色
 *   hoverColor:0xff9933,            // 线的鼠标移入基线颜色
 *   spaceHeight:5,                  // 曲线空间高度
 *   hasHalo:true,                   // 是否有发光线
 *   hasHaloAnimate:true,            // 是否开启发光线动画效果
 *   haloDensity:2,                  // 光点密度 值越大 越浓密，越消耗性能
 *   haloRunRate:0.01,               // 光点运动频率
 *   haloColor:0xffffff,             // 发光线颜色，默认继承color
 *   haloSize:10,                    // 发光线粗细
 * }
 * let line = new Line(opt);
 * */
class Line extends THREE.Line{
  /**
   * 光点纹理样式,返回一个纹理 {@link https://threejs.org/docs/#api/textures/Texture|THREE.Texture}
   * @returns {THREE.Texture}
   * @example
   * Line.texture()
   */
  static get texture(){
    if(!Mark._texture)
    {
      let canvas = document.createElement("canvas");
      canvas.width=128;
      canvas.height=128;
      let context = canvas.getContext('2d');
      Mark.draw(context);
      let texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      Mark._texture=texture;
    }
    return Mark._texture;
  }

  /**
   * 光点纹理样式,如果你对canvas熟悉可以重写.否则使用默认样式
   * @static
   * @param {context} context - Canvas上下文对象 {@link https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext|Canvas.context}
   * @example
   *
   * Line.draw=(ctx)=>{
     *  context.clearRect(0, 0, 128, 128);
     *  context.fillStyle = '#ff0000';
     *  context.arc(64, 64, 20, 0, Math.PI * 2, false);
     *  context.fill();
     * }
   */
  static draw(context){
    context.clearRect(0, 0, 128, 128);
    context.fillStyle = '#ffffff';
    context.arc(64, 64, 20, 0, Math.PI * 2, false);
    context.fill();

    context.fillStyle = 'rgba(255,255,255,.5)';
    context.arc(64, 64, 60, 0, Math.PI * 2, false);
    context.fill();

    context.fillStyle = 'rgba(0,0,0,1)';
    context.arc(64, 64, 80, 0, Math.PI * 2, false);
    context.fill();
  }

  /**
   * 创建一条线
   * @param {Object} pros - The Line options | 线的配置
   * @param {string} pros.color - Line base color | 基线颜色
   * @param {string} pros.hoverColor - Line base hoverColor | 线的鼠标移入基线颜色
   * @param {number} pros.spaceHeight - Line space height | 曲线空间高度
   * @param {boolean} pros.hasHalo - Has light emitting line| 是否有发光线
   * @param {boolean} pros.hasHaloAnimate - Has light emitting line Animate| 是否有发光线动画效果
   * @param {number} pros.haloDensity - Spot density becomes more dense, more consumption performance | 光点密度 值越大 越浓密，越消耗性能
   * @param {number} pros.haloRunRate - Light point motion frequency | 光点运动频率
   * @param {color} pros.haloColor - Halo line color, default inheritance of color | 发光线颜色，默认继承color
   * @param {number} pros.haloSize - Halo line color width | 发光线粗细
   */
  constructor(pros){
    // pros:
    // {
    //   color:0x55eeff,                 // 基线颜色
    //   hoverColor:0xff9933,            // 线的鼠标移入基线颜色
    //   spaceHeight:5,                  // 曲线空间高度
    //   hasHalo:true,                   // 是否有发光线
    //   hasHaloAnimate:true,            // 是否开启发光线动画效果
    //   haloDensity:2,                  // 光点密度 值越大 越浓密，越消耗性能
    //   haloRunRate:0.01,               // 光点运动频率
    //   haloColor:0xffffff,             // 发光线颜色，默认继承color
    //   haloSize:10,                    // 发光线粗细
    // }
    let fromCoord=pros.coords[0];
    let toCoord=pros.coords[1];
    let x1 = fromCoord[0];
    let y1 = fromCoord[1];
    let x2 = toCoord[0];
    let y2 = toCoord[1];
    let xdiff = x2 - x1;
    let ydiff = y2 - y1;
    let dif = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);//二点间距离
    let v3s=[
      new THREE.Vector3( x1, y1, pros.extrudeHeight ),
      new THREE.Vector3( (x1+x2)/2, (y1+y2)/2, pros.extrudeHeight + pros.spaceHeight),
      new THREE.Vector3( x2, y2, pros.extrudeHeight )
    ]

    //画弧线
    let curve = new THREE.QuadraticBezierCurve3(...v3s);
    var geometry = new THREE.Geometry();
    var amount = (dif+0.1) * pros.haloDensity;
    if(amount<30)amount=30;

    geometry.vertices = curve.getPoints(amount).reverse();
    geometry.vertices.forEach(()=>{
      geometry.colors.push(new THREE.Color(0xffffff));
    })

    let material =  new THREE.LineBasicMaterial({
      color:pros.color,
      opacity: 1.0,
      blending:THREE.AdditiveBlending,
      transparent:true,
      depthWrite: false,
      vertexColors: true,
      linewidth: 1 })

    super(geometry, material)

    Object.assign(this.userData,pros);

    //线条光晕效果
    if(pros.hasHalo) {
      this.initHalo(geometry);
    }
    //当前线条索引
    this.index=Line.count++;
    Line.array.push(this);
  }

  /**
   * 初始化发光线
   * @param {THREE.Geometry} geometry - 通过线条几何体初始化发光线 {@link https://threejs.org/docs/#api/core/Geometry|THREE.Geometry}
   * @protected
   */
  initHalo(geometry){
    let line = this;
    let amount=geometry.vertices.length;
    let positions = new Float32Array(amount * 3);
    let colors = new Float32Array(amount * 3);
    let sizes = new Float32Array(amount);
    let vertex = new THREE.Vector3();
    let color = new THREE.Color(colorToHex(this.userData.color));
    for (let i = 0; i < amount; i++) {

      vertex.x = geometry.vertices[i].x;
      vertex.y = geometry.vertices[i].y;
      vertex.z = geometry.vertices[i].z;
      vertex.toArray(positions, i * 3);

      // if ( vertex.x < 0 ) {
      //   color.setHSL( 0.5 + 0.1 * ( i / amount ), 0.7, 0.5 );
      // } else {
      //   color.setHSL( 0.0 + 0.1 * ( i / amount ), 0.9, 0.5 );
      // }
      color.toArray(colors, i * 3);
      sizes[i] = line.userData.haloSize;
    }
    //positions = geometry.vertices;

    let psBufferGeometry = new THREE.BufferGeometry();
    psBufferGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    psBufferGeometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    psBufferGeometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

    let uniforms = {
      amplitude: {value: 1.0},
      color: {value: new THREE.Color(colorToHex(this.userData.haloColor))},
      texture: {value: Line.texture},
    };

    let shaderMaterial = new THREE.ShaderMaterial({

      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,

      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true,
      // sizeAttenuation: true,
    });

    //线条光晕
    let halo = new THREE.Points(psBufferGeometry, shaderMaterial);
    halo.dynamic = true;
    this.add(halo);
    this.halo = halo;


    halo.update = function(){
      if(!line.userData.hasHalo || !line.userData.hasHaloAnimate)
        return;

      let time = Date.now() * 0.005 + line.index * 3;

      let geometry = this.geometry;
      let attributes = geometry.attributes;
      for ( let i = 0; i < attributes.size.array.length; i++ ) {
        attributes.size.array[ i ] = line.userData.haloSize + line.userData.haloSize * Math.sin( (line.userData.haloRunRate * i + time) ) ;
      }
      attributes.size.needsUpdate = true;
    }

  }

  /**
   * 发光线的动画更新方法
   * @private
   */
  update(){
    //if(!this.userData.hasHalo || !this.userData.hasHaloAnimate)
    this.halo.update();
  }

  /**
   * 修改线颜色
   * @param {color} color - 线条颜色
   * @example
   *
   * line.setColor(0xff0000);
   * line.setColor('hsl(240,100%,50%)');
   * line.setColor('rgb(255,255,0)');
   */
  setColor(color,haloColor){
    //基线
    if(typeof color!=='undefined')
      this.material.color=new THREE.Color(colorToHex(color));
    // //光线
    // if(typeof haloColor!=='undefined' && this.userData.hasHalo )
    // {
    //   let color = new THREE.Color(colorToHex(haloColor));
    //   let colors=this.halo.geometry.attributes.customColor;
    //   for ( let i = 0; i < colors.array.length; i+=3 ) {
    //     colors.array[ i ] = color.r;
    //     colors.array[ i + 1] = color.g;
    //     colors.array[ i + 2] = color.b;
    //   }
    //   this.halo.geometry.attributes.customColor.needsUpdate = true;
    // }
  }

  /**
   * 设置发光线宽度,基线永远是1
   * @param {number} size - 发光线粗细大小
   */
  setLineWidth(size){
    if(!this.userData.hasHalo)
    {
      console.warn('Setting the LineWidth must be hasHalo:true')
    }
    //粗细
    this.userData.haloSize=size;
  }

  /**
   * 线条鼠标移出事件
   *
   * @param dispatcher
   * @param event
   * @protected
   * @example
   *  // 注册事件
   *  map.addEventListener('mouseout', (event) => {
     *        let obj = event.target;
     *
     *        if(obj.type==='Line')
     *        {
     *           // 这里做鼠标移出操作
     *        }
     *      });
   */
  onmouseout(dispatcher,event){
    if(this.userData.hoverExclusive){
      //所有线条回复初始
      Line.array.map((line)=>{
        if(line.halo){
          line.halo.visible=true
        }
        line.setColor(line.userData.color);
      });
    }

    //选中线条
    if(this.userData.hasHalo)
    {
      //粗细
      let size=this.userData.haloSize/1.5
      this.userData.haloSize=size;
    }
    //颜色
    this.setColor(this.userData.color);
    dispatcher.dispatchEvent({ type: 'mouseout', target:this, orgEvent:event});
  }
  /**
   * 线条鼠标移入事件
   * @param dispatcher
   * @param event
   * @protected
   * @example
   *  // 注册事件
   *  map.addEventListener('mouseover', (event) => {
     *        let obj = event.target;
     *
     *        if(obj.type==='Line')
     *        {
     *           // 这里做鼠标移入操作
     *        }
     *      });
   */
  onmouseover(dispatcher,event){
    if(this.userData.hoverExclusive)
    {
      Line.array.map((line)=>{
        if(line.halo){
          line.halo.visible=false
        }
        line.setColor(this.userData.decayColor);

      });
    }

    //选中线条
    if(this.userData.hasHalo)
    {
      //修改光点线 大小
      let size=this.userData.haloSize*1.5
      this.userData.haloSize=size;
      this.halo.visible=true;
    }
    //颜色
    this.setColor(this.userData.hoverColor?this.userData.hoverColor:this.userData.color);
    dispatcher.dispatchEvent({ type: 'mouseover', target:this, orgEvent:event});
  }
  /**
   * 线条鼠标单击事件
   * @param dispatcher
   * @param event
   * @protected
   * @example
   *  // 注册事件
   *  map.addEventListener('mousedown', (event) => {
     *        let obj = event.target;
     *
     *        if(obj.type==='Line')
     *        {
     *           // 这里做鼠标单击操作
     *        }
     *      });
   */
  onmousedown(dispatcher,event) {
    dispatcher.dispatchEvent({ type: 'mousedown', target:this, orgEvent:event});
  }
}
/**
 * 线条数量
 * @static
 * @type {number}
 */
Line.count=0;
Line.array=[];
Line._texture=null;

/**
 * 线条着色器
 * @type {{vertexShader: string, fragmentShader: string}}
 */
let shader={
  vertexShader: [
    "uniform float amplitude;",
    "attribute float size;",
    "attribute vec3 customColor;",
    "varying vec3 vColor;",
    "void main() {",
    "vColor = customColor;",
    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    "gl_PointSize = size;",
    "gl_Position = projectionMatrix * mvPosition;",
    "}"
  ].join("\n"),
  fragmentShader: [
    "uniform vec3 color;",
    "uniform sampler2D texture;",
    "varying vec3 vColor;",
    "void main() {",
    "gl_FragColor = vec4( color * vColor, 1.0 );",
    "gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );",
    "}"
  ].join("\n")
}


/**
 * 颜色格式化 '#999999','rgb(255,255,255)','hsl(200,100%,30%)',0x999999
 * @param {string|number} color - 需要转换的颜色表达式
 * @returns {number} - 颜色的16进制
 * @example
 *
 * let color = colorToHex('#336699')
 *
 */
function colorToHex(color){
  if(typeof color==="string" )
  {
    if(color.indexOf('#')!==-1)
      color = parseInt(color.replace('#',''),16);
    else
      color = new THREE.Color(color).getHex();
  }
  return color;
}

export const $ = function() {
  var copyIsArray,
    toString = Object.prototype.toString,
    hasOwn = Object.prototype.hasOwnProperty,

    class2type = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Object]': 'object'
    },

    type = function(obj) {
      return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
    },

    isWindow = function(obj) {
      return obj && typeof obj === "object" && "setInterval" in obj;
    },

    isArray = Array.isArray || function(obj) {
        return type(obj) === "array";
      },

    isPlainObject = function(obj) {
      if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
        return false;
      }

      if (obj.constructor && !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
      }

      var key;
      for (key in obj) {}

      return key === undefined || hasOwn.call(obj, key);
    },

    extend = function(deep, target, options) {
      for (var name in options) {
        var src = target[name];
        var copy = options[name];

        if (target === copy) {
          continue;
        }

        if (deep && copy &&
          (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            var clone = src && isArray(src) ? src : [];

          } else {
            var clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }

      return target;
    };

  return { extend: extend };
}();

export {
  Map3D,
  Area,
  Mark,
  Line,
  DataRange
}
