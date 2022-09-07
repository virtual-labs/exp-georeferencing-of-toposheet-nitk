$(window).on("load",function() {
    //VARS===================================================
    var zoom = {
      zoomboxLeft:null, zoomboxTop:null, //zoombox
      cursorStartX:null, cursorStartY:null, //cursor
      imgStartLeft:null, imgStartTop:null, //image
      minDragLeft:null,maxDragLeft:null, minDragTop:null,maxDragTop:null,
      zoomStatus: null
    };
    
    //KEY-HANDLERS===========================================
    $(document).keydown(function(e) {
      if (e.which==32) {e.preventDefault(); if (!$(".zoombox img").hasClass("moving")) {$(".zoombox img").addClass("drag");}} //SPACE
    });
    $(document).keyup(function(e) {
      if (e.which==32) {if (!$(".zoombox img").hasClass("moving")) {$(".zoombox img").removeClass("drag");}} //SPACE
    });
    
    //RESET IMAGE SIZE=======================================
    $(".reset").on("click",function() {
      var zoombox = "#"+$(this).parent().attr("id")+" .zoombox";
      // console.log(zoombox);
      $(zoombox+" img").css({"left":0, "top":0, "width":$(zoombox).width(), "height":$(zoombox).height()});
      document.getElementById("reset").style.visibility = "hidden";
      setImage();
    }).click();
    
    
    $(".max").on("click",function() {
        // var zoombox = "#"+$(this).parent().attr("id")+" .zoombox";
        // $(zoombox+" img").css({"left":0, "top":0, "width":$(zoombox).width()*3, "height":$(zoombox).height()*3});
        var container = $(".zoombox");
        var image = $(".zoombox img");
        // console.log(container.height())
        var css = {};
    
        css.height = image.height() + (image.height() * 0.2);
        css.width = image.width() + (image.width() * 0.2);
        
        var x = Math.abs(image.position().left) + container.width() / 2;
        var y = Math.abs(image.position().top) + container.height() / 2;
        
        var ratio = css.width / image.width();
        
        var newX = x * ratio;
        var newY = y * ratio;
        
        css.left = image.position().left - (newX - x);
        css.top = image.position().top - (newY - y);
        // css.margin = (container.height() -image.height()/2);
        image.css(css);
        zoom.zoomStatus = ratio;
        document.getElementById("range").innerHTML = css.width;
      });


      $(".min").on("click",function() {
        // var zoombox = "#"+$(this).parent().attr("id")+" .zoombox";
        // $(zoombox+" img").css({"left":0, "top":0, "width":$(zoombox).width()*3, "height":$(zoombox).height()*3});
        var container = $(".zoombox");
        var image = $(".zoombox img");
        
        var css = {};
    
        css.height = image.height() - (image.height() * 0.2);
        css.width = image.width() - (image.width() * 0.2);
        
        var x = Math.abs(image.position().left) +  container.width() / 2;
        var y = Math.abs(image.position().top) + container.height() / 2;
        
        var ratio = css.width / image.width();
        
        var newX = x * ratio;
        var newY = y * ratio;
        
        css.left = image.position().left - (newX - x);
        css.top = image.position().top - (newY - y);
        
        image.css(css);
        // zoom.zoomStatus = ratio;
        document.getElementById("range").innerHTML = css.width;

      });
    
    //ZOOM&DRAG-EVENTS=======================================
    //MOUSEDOWN----------------------------------------------
    $(".zoombox img").mousedown(function(e) {
      e.preventDefault();
      document.getElementById("zoomIn").style.visibility = "hidden";  
      document.getElementsByClassName("mP")[0].style.visibility = "hidden"; 
      document.getElementsByClassName("mP")[1].style.visibility = "hidden"; 
      document.getElementsByClassName("mP")[2].style.visibility = "hidden"; 
      document.getElementsByClassName("mP")[3].style.visibility = ""; 
      $(".zoombox img").addClass("moving");
      var selector = $(this).next();
      var zoombox = $(this).parent();
      $(zoombox).addClass("active");
      
      //store zoombox left&top
      zoom.zoomboxLeft = $(zoombox).offset().left + parseInt($(zoombox).css("border-left-width").replace(/\D+/,""));
      zoom.zoomboxTop = $(zoombox).offset().top + parseInt($(zoombox).css("border-top-width").replace(/\D+/,""));
      
      //store starting positions of cursor (relative to zoombox)
      zoom.cursorStartX = e.pageX - zoom.zoomboxLeft;
      zoom.cursorStartY = e.pageY - zoom.zoomboxTop;
      
      if ($(".zoombox img").hasClass("drag")) {
        //store starting positions of image (relative to zoombox)
        zoom.imgStartLeft = $(this).position().left;
        zoom.imgStartTop = $(this).position().top;
        
        //set drag boundaries (relative to zoombox)
        zoom.minDragLeft = $(zoombox).width() - $(this).width();
        zoom.maxDragLeft = 0;
        zoom.minDragTop = $(zoombox).height() - $(this).height();
        zoom.maxDragTop = 0;
      } else {
        //set drag boundaries (relative to zoombox)
        zoom.minDragLeft = 0;
        zoom.maxDragLeft = $(zoombox).width();
        zoom.minDragTop = 0;
        zoom.maxDragTop = $(zoombox).height();
        
        //activate zoom-selector
        $(selector).css({"display":"block", "width":0, "height":0, "left":zoom.cursorStartX, "top":zoom.cursorStartY});
      }
    });
    
    //MOUSEMOVE----------------------------------------------
    $(document).mousemove(function(e) {
      if ($(".zoombox img").hasClass("moving")) {
        if ($(".zoombox img").hasClass("drag")) {
          var img = $(".zoombox.active img")[0];
          
          //update image position (relative to zoombox)
          $(img).css({
            "left": zoom.imgStartLeft + (e.pageX-zoom.zoomboxLeft)-zoom.cursorStartX,
            "top": zoom.imgStartTop + (e.pageY-zoom.zoomboxTop)-zoom.cursorStartY
          });
          //prevent dragging in prohibited areas (relative to zoombox)
          if ($(img).position().left <= zoom.minDragLeft) {$(img).css("left",zoom.minDragLeft);} else 
          if ($(img).position().left >= zoom.maxDragLeft) {$(img).css("left",zoom.maxDragLeft);}
          if ($(img).position().top <= zoom.minDragTop) {$(img).css("top",zoom.minDragTop);} else 
          if ($(img).position().top >= zoom.maxDragTop) {$(img).css("top",zoom.maxDragTop);}
        } else {
          //calculate selector width and height (relative to zoombox)
          var width = (e.pageX-zoom.zoomboxLeft)-zoom.cursorStartX;
          var height = (e.pageY-zoom.zoomboxTop)-zoom.cursorStartY;
          
          //prevent dragging in prohibited areas (relative to zoombox)
          if (e.pageX-zoom.zoomboxLeft <= zoom.minDragLeft) {width = zoom.minDragLeft - zoom.cursorStartX;} else 
          if (e.pageX-zoom.zoomboxLeft >= zoom.maxDragLeft) {width = zoom.maxDragLeft - zoom.cursorStartX;}
          if (e.pageY-zoom.zoomboxTop <= zoom.minDragTop) {height = zoom.minDragTop - zoom.cursorStartY;} else 
          if (e.pageY-zoom.zoomboxTop >= zoom.maxDragTop) {height = zoom.maxDragTop - zoom.cursorStartY;}
          
          //update zoom-selector
          var selector = $(".zoombox.active .selector")[0];
          $(selector).css({"width":Math.abs(width), "height":Math.abs(height)});
          if (width<0) {$(selector).css("left",zoom.cursorStartX-Math.abs(width));}
          if (height<0) {$(selector).css("top",zoom.cursorStartY-Math.abs(height));}
        }
      }
    });
    
    //MOUSEUP------------------------------------------------
    $(".zoombox").mouseup(function() {
        // document.getElementById("reset").style.visibility = "visible";
        if ($(".zoombox img").hasClass("moving")) {
        if (!$(".zoombox img").hasClass("drag")) {
          var img = $(".zoombox.active img")[0];
          var selector = $(".zoombox.active .selector")[0];
          
          if ($(selector).width()>0 && $(selector).height()>0) {
            //resize zoom-selector and image
            var magnification = ($(selector).width()<$(selector).height() ? $(selector).parent().width()/$(selector).width() : $(selector).parent().height()/$(selector).height()); //go for the highest magnification
            var hFactor = $(img).width() / ($(selector).position().left-$(img).position().left);
            var vFactor = $(img).height() / ($(selector).position().top-$(img).position().top);
            $(selector).css({"width":$(selector).width()*magnification, "height":$(selector).height()*magnification});
            $(img).css({"width":$(img).width()*magnification, "height":$(img).height()*magnification});
            //correct for misalignment during magnification, caused by size-factor
            $(img).css({
              "left": $(selector).position().left - ($(img).width()/hFactor),
              "top": $(selector).position().top - ($(img).height()/vFactor)
            });
            
            //reposition zoom-selector and image (relative to zoombox)
            var selectorLeft = ($(selector).parent().width()/2) - ($(selector).width()/2);
            var selectorTop = ($(selector).parent().height()/2) - ($(selector).height()/2);
            var selectorDeltaLeft = selectorLeft - $(selector).position().left;
            var selectorDeltaTop = selectorTop - $(selector).position().top;
            $(selector).css({"left":selectorLeft, "top":selectorTop});
            $(img).css({"left":"+="+selectorDeltaLeft, "top":"+="+selectorDeltaTop});
          }
          //deactivate zoom-selector
          $(selector).css({"display":"none", "width":0, "height":0, "left":0, "top":0});
        } else {$(".zoombox img").removeClass("drag");}
        $(".zoombox img").removeClass("moving");
        $(".zoombox.active").removeClass("active");
      }
    });
  });
  let defineProjections = {
    "InputDataset": "nd-43-15.tiff",
    "CoordinateSystem": "GCS_WGS_1984",
  }

  let projectionRaster = {
    "InputRaster": "nd-43-15.tiff",
    "CoordinateSystem": "GCS_WGS_1984",
    "OutputCoordinateSystem": "WGS_1984_UTM_Zone_43N",

  }
  let actionInfo = [
    {
      id: "act1",
      content: [
        "Geographic Coordinate System: It is the location reference system for spatial features on the Earth’s surface. It is defined by longitude and latitude which are angular measures",
        "Geographic Coordinate Systems > World > WGS 1984"],
      visibility: false
    },
    {
      id:"act2",
      content: [
        "Projected coordinate system: It is based on a map projection such as transverse Mercator, Albers equal area, or Robinson, all of which (along with numerous other map projection models) provide various mechanisms to project maps of the earth's spherical the surface onto a two-dimensional Cartesian coordinate plane. Projected coordinate systems are sometimes referred to as map projections.",
        "Projected Coordinate Systems > UTM > WGS 1984 > Northern Hemisphere > WGS 1984 UTM Zone 43N"],
      visibility: false
    },
    {
      id:"act3",
      content: [
        "Deciaml Degrees = deg+<span class='frac'><sup>min</sup><span>&frasl;</span><sub>60</sub></span>+<span class='frac'><sup>sec</sup><span>&frasl;</span><sub>3600</sub></span>"
      ],
      visibility: false
    },
  ]

  let data = [
      {pt: 1, xi: 608351.897882, yi: 1437383.514911,	x: 76.000000,	y: 13.000000, zx: "490px", zy: "82px", mx: "486px", my: "67px", set: false},
      {pt: 2, xi: 608923.062784, yi: 1326762.639946, x:	76.000000, y:	12.000000, zx: "490px", zy: "490px",  mx: "486px", my: "458px", set: false},
      {pt: 3, xi: 445501.727283, yi: 1326575.829708,	x: 74.500000,	y: 12.000000, zx: "60px", zy: "490px",  mx: "70px", my: "458px", set: false},
      {pt: 4, xi: 445843.314957, yi: 1437122.028079, 	x: 74.500000,	y: 13.000000, zx: "60px", zy: "82px",  mx: "70px", my: "67px",set: false},

      {pt: 5, xi: 60866.3863,	yi: 1381977.043, 	x: 75.150000,	y: 12.500000, zx: "60px", zy: "82px",  mx: "70px", my: "67px",set: false},
      {pt: 6, xi: 527208.565,	yi: 1326460.922, 	x: 75.150000,	y: 12.000000, zx: "60px", zy: "82px",  mx: "70px", my: "67px",set: false},
      {pt: 7, xi: 445681.316,	yi: 1381861.094, 	x: 74.500000,	y: 12.500000, zx: "60px", zy: "82px",  mx: "70px", my: "67px",set: false},
      {pt: 8, xi: 527053.7,	yi: 1437028.4, 	x: 75.150000,	y: 13.000000, zx: "60px", zy: "82px",  mx: "70px", my: "67px",set: false},
      {pt: 9, xi: 527144.599,	yi: 1382208.507, 	x: 75.250000,	y: 12.500000, zx: "60px", zy: "82px",  mx: "70px", my: "67px",set: false},
  ]

  let coData = [
    {coId: 0, initialCoordLeft: "43px", initialCoordTop: "75px", finalCoordLeft: "59px", finalCoordTop: "75px", initialWidth: "auto", finalWidth: "45px", id: "tl", spanId: "tls", class: "coordTooltiptext", index: 3 },
    {coId: 1, initialCoordLeft: "457px", initialCoordTop: "75px", finalCoordLeft: "476px", finalCoordTop: "75px", initialWidth: "auto", finalWidth: "45px", id: "tr",spanId: "trs",  class: "coordTooltiptext", index: 0 },
    {coId: 2, initialCoordLeft: "42px", initialCoordTop: "505px", finalCoordLeft: "56px", finalCoordTop: "502px", initialWidth: "auto", finalWidth: "45px", id: "bl", spanId: "bls", class: "bottomTooltiptext",index: 2 },
    {coId: 3, initialCoordLeft: "457px", initialCoordTop: "505px", finalCoordLeft: "475px", finalCoordTop: "505px", initialWidth: "auto", finalWidth: "45px", id: "br", spanId:"brs", class: "bottomTooltiptext",index: 1 },
    {coId: 4, initialCoordLeft: "503px", initialCoordTop: "265px", finalCoordLeft: "503px", finalCoordTop: "265px", initialWidth: "80px", finalWidth: "45px", id: "mr", spanId:"mrs", class: "rightTooltiptext",index: 4 },
    {coId: 5, initialCoordLeft: "253px", initialCoordTop: "505px", finalCoordLeft: "265px", finalCoordTop: "505px", initialWidth: "80px", finalWidth: "45px", id: "bm", spanId:"bms", class: "bottomTooltiptext",index: 5 },
    {coId: 6, initialCoordLeft: "0px", initialCoordTop: "265px", finalCoordLeft: "25px", finalCoordTop: "270px", initialWidth: "75px", finalWidth: "45px", id: "ml", spanId:"mls", class: "leftTooltiptext",index: 6 },
    {coId: 7, initialCoordLeft: "253px", initialCoordTop: "75px", finalCoordLeft: "265px", finalCoordTop: "75px", initialWidth: "80px", finalWidth: "45px", id: "tm", spanId:"tms", class: "coordTooltiptext",index: 7 },
    {coId: 8, initialCoordLeft: "253px", initialCoordTop: "265px", finalCoordLeft: "253px", finalCoordTop: "270px", initialWidth: "80px", finalWidth: "45px", id: "mm", spanId:"mms", class: "coordTooltiptext",index: 8 },
  ]

  let point = -1;
  let rmsError = 0.000793879;
  //Evaluate
  let validX = false;
  let validY = false;
  //all points set
  let allSet = false;
  let inference = 0;
  function showPopup(ele){
      document.getElementById("parentPopup").style.display = "block";
      document.getElementById("coordinatePopup").style.zIndex = "-1"; 
      document.getElementById("popUpContent").innerHTML = `
          <span class="close"
              onclick="closeModal(event);">&#10006;</span>`
      displayOptions(ele);
  }

  function closeModal(ev){
      if(ev.target.className == "parentPopup" || ev.target.className == "close") {
          document.getElementById("parentPopup").style.display = "none";
          document.getElementById("coordinatePopup").style.zIndex = "100"; 
      }
  }


  function goToMainPage(){
      document.getElementById("canvas0").style.visibility = "hidden";
      document.getElementById("canvas1").style.visibility = "visible";
      document.getElementById("zoomDiv").style.visibility = "visible";
      document.getElementById("nextButton").style.visibility = "hidden";
      

  }

  function displayOptions(ele) {
      if(ele.id == "act1" && allSet == true){
        defineProjection();
      }
      if(ele.id == "act2" && allSet == true){
        projectRaster();
      }
      if(ele.id == "act3" && allSet == true){
        setTable();
      }
      if(ele.id == "act4"){
        downloadData();
      }
      
  }

  function showInfo(ele) {
    const found = actionInfo.find(function(actionInfo){
      return actionInfo.id === ele.parentNode.id
    });
    found.visibility = true;
    found.visibility == true?
    (
      document.getElementById("tooltiptext").style.visibility = "visible",
      document.getElementById("tooltiptext").innerHTML = `
        <h3>${ele.parentNode.innerText}</h3>
        `,
        
      found.content.forEach(function(content){
        document.getElementById("tooltiptext").innerHTML+=`
        <p>${content}</p>
        `
      })
        
    )
    :document.getElementById("tooltiptext").style.visibility = "hidden";
  }



  function hideInfo(ele){
    const found = actionInfo.find(function(actionInfo){
      return actionInfo.id === ele.parentNode.id
    });
    found.visibility = false;
    found.visibility == true?document.getElementById("tooltiptext").style.visibility = "visible":document.getElementById("tooltiptext").style.visibility = "hidden";
  
  }

  function defineProjection(){
    document.getElementById("notify").style.animation= '';
    document.getElementById("notify").style.animation = 'animOpacity 2s reverse';
    resetZoom();
    document.getElementById("popUpContent").innerHTML = `
    <span class="close"
        onclick="closeModal(event);">&#10006;</span>
        <div class="flex-container">
          <div style="flex-basis: 180px">Input Dataset:</div>
          <div ><input type="text" value=${defineProjections.InputDataset} disabled/></div>
        </div>
        <div class="flex-container">
          <div style="flex-basis: 180px">Coordinate System:</div>
          <div ><input type="text" value=${defineProjections.CoordinateSystem} disabled/></div>
        </div>
        <div class="flex-container">
          <div style="flex-basis: 180px;"></div>
          <div><button class="btn" style="width: 50px" onclick="lockAction1()">OK</button></div>
        </div>
    `
}

function projectRaster(){
  document.getElementById("notify").style.animation= '';
  document.getElementById("notify").style.animation = 'animOpacity 2s reverse';
  resetZoom();
  document.getElementById("popUpContent").innerHTML = `
      <span class="close"
          onclick="closeModal(event);">&#10006;</span>
          <div class="flex-container">
            <div style="flex-basis: 180px">Input Raster:</div>
            <div ><input type="text" style="width: 190px"  value=${projectionRaster.InputRaster} disabled/></div>
          </div>
          <div class="flex-container">
            <div style="flex-basis: 180px">Input Coordinate System(optional):</div>
            <div ><input type="text" style="width: 190px" value=${projectionRaster.CoordinateSystem} disabled/></div>
          </div>
          <div class="flex-container">
            <div style="flex-basis: 180px">Output Coordinate System:</div>
            <div><input type="text" style="width: 190px" value=${projectionRaster.OutputCoordinateSystem} disabled/></div>
          </div>
          <div class="flex-container">
            <div style="flex-basis: 180px;"></div>
            <div><button class="btn" style="width: 50px" onclick="lockAction2()">OK</button></div>
          </div>
      `
}



function lockAction1() {
  document.getElementById("act1").disabled = true;
  document.getElementById("act2").disabled = false;
  document.getElementById("parentPopup").style.display = "none"; 
  document.getElementById("coordinatePopup").style.zIndex = "100"; 
  // document.getElementById("notify").style.animation= '';
  messagePopup("Select the Projected Coordinate System and then the Northern Hemisphere is selected for Mangalore - WGS1984 UTM Zone43N");
}
function lockAction2() {
  document.getElementById("act2").disabled = true;
  document.getElementById("parentPopup").style.display = "none";
  document.getElementById("coordinatePopup").style.zIndex = "100"; 
  inference = 1;
  messagePopup("The given toposheet of Mangalore has been georeferenced.");
}


function showSelectPoint(){
  if(document.getElementById("points").style.visibility == "visible") {
    document.getElementById("points").style.visibility = "hidden";
    document.getElementById("formData").style.visibility = "hidden";

  } else {
    document.getElementById("points").style.visibility = "visible";
    setZindex();
  }
}

function showCoord(ele){
  // hideTooltip();
  document.getElementById("zSpan").innerHTML = "";
  var zoombox = "#"+$('#reset').parent().attr("id")+" .zoombox";
  $(zoombox+" img").css({"left":0, "top":0, "width":$(zoombox).width(), "height":$(zoombox).height()});
  point = Number(ele.value);
  if(ele.value >= 0){  
    document.getElementById("formData").style.visibility = "visible";
    document.getElementById("x").value = data[ele.value].xi;
    document.getElementById("y").value = data[ele.value].yi;
    document.getElementById("zoomIn").style = `position: absolute; left: ${data[ele.value].zx}; top: ${data[ele.value].zy};visibility: visible`;
    document.getElementById("zSpan").style.visibility = "visible";   
    document.getElementById("zSpan").innerHTML = "Coordinates: Zoom In Map here <img src='./images/zoomIn.png' width='23px'/>";
    document.getElementById("coordinatePopup").style.zIndex = "-2";
  } else {
    document.getElementById("zoomIn").style.visibility = "hidden";   
    document.getElementById("formData").style.visibility = "hidden";  
  }
}

function dataCheckX(ele){
  ele.value = ele.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
  document.getElementById("sx").innerHTML = "";
  if(ele.value != data[point].x){
    document.getElementById("sx").innerHTML= "&#10008;"
  } else {
    validX = true;
    document.getElementById("sx").innerHTML = "";
  }
}
function dataCheckY(ele){
  ele.value = ele.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
  document.getElementById("sy").innerHTML = "";
  if(ele.value != data[point].y){
    document.getElementById("sy").innerHTML= "&#10008;"
  } else {
    validY = true;
    document.getElementById("sy").innerHTML = "";
  }
}

function addPoints(){
  let pt = point+1;
  // document.getElementById("reset").style.visibility = "hidden";   
  if(validX == true && validY == true) {
    document.getElementById("formData").style.visibility = "hidden"; 
    document.getElementById("zoomIn").style.visibility = "hidden";     
    document.getElementById("points").options[point+1].disabled = true;
    data[point].set = true;
    var zoombox = "#"+$('#reset').parent().attr("id")+" .zoombox";
    $(zoombox+" img").css({"left":0, "top":0, "width":$(zoombox).width(), "height":$(zoombox).height()});
    setImage();
    validX = false;
    validY = false;
    document.getElementById("zSpan").innerHTML = `Point ${point+1} Added`;
    resetSelect();
    setTimeout(function(){
      document.getElementById("zSpan").innerHTML = "";
    },400);
    if(point<=2) {
      document.getElementById("points").options[point+2].disabled = false;
    } else if(point>2){
      allSet = true;
      resetZoom();
      document.getElementById("points").style.visibility = "hidden";
      document.getElementById("act3").setAttribute("onclick", "showPopup(this)");  
      document.getElementById("zSpan").innerHTML = "Updating control points.....";
      setTimeout(function(){
        // document.getElementById("zSpan").innerHTML = "Control Points Updated";
        document.getElementById("act3").innerHTML = "Data Set";
        messagePopup("The digital image is saved in.TIFF format and the saved “.TIFF” file is added to our workspace for further processing of the data. Go to Define Projections");
        setTimeout(function(){
          document.getElementById("coordinatePopup").style.zIndex = "100"; 
          document.getElementById("zSpan").innerHTML = "";
          document.getElementById("act1").disabled = false;
        },1500);
      },800);
    }  
  } 
}

function setImage(){
  data.forEach(function(d){
    if(d.pt === 1 || d.pt === 2 || d.pt === 3 || d.pt === 4) {
      if(d.set == true){
        document.getElementById("mp"+d.pt).style = `position: absolute; left: ${d.mx}; top: ${d.my};visibility: visible`;
      }
    }
  })
}

function clearFields(){
  document.getElementById("x").value = "";
  document.getElementById("y").value = "";
}

function resetSelect(){
  document.getElementById("points").selectedIndex = 0;
}


function setTable(){
  document.getElementById("popUpContent").innerHTML = `
  <span class="close"
      onclick="closeModal(event);">&#10006;</span>
      <p style="padding-left: 10px; padding-top: 10px; font-family: verdana; font-size: 14px">Total RMS Error: Forward ${rmsError} </p>
     <table class="tableStyle">
      <thead>
        <th>Link</th>
        <th>X Source</th>
        <th>Y Source</th>
        <th>X Map</th>
        <th>Y Map</th>
      </thead>
      <tbody id="tableData">
      </tbody>
     </table>
  `
  filltable();
 }
function filltable(){
  let tableData = "";
  data.forEach(function(point){
    if(point.pt<=4){
      document.getElementById("tableData").innerHTML+=
     `
      <td>${point.pt}</td>     
      <td>${point.xi}</td>     
      <td>${point.yi}</td>
      <td>${point.x}</td>
      <td>${point.y}</td>`
    }
  })
  document.getElementById("popUpContent").innerHTML += `
  `
}

let myImg = document.getElementById("mapImage");


function showInitialCoordinates(ele){
  switch(ele.id){
    case "t1":       {
      setCoordinates(0);
      break;
    }
    case "t3": {
      setCoordinates(1);
      break;
    }
    case "b1": {
      setCoordinates(2);
      break;
    }
    case "b3": {
      setCoordinates(3);
      break;
    }
    case "m3": {
      setCoordinates(4);
      break;
    }
    case "b2": {
      setCoordinates(5);
      break;
    }
    case "m1": {
      setCoordinates(6);
      break;
    }
    case "t2": {
      setCoordinates(7);
      break;
    }
    case "m2": {
      setCoordinates(8);
      break;
    }
  }
}

function hideTooltip(id){
    document.getElementById(id).style.visibility = "hidden"; 
}
 
function setCoordinates(coId){
  if(allSet === false){
    document.getElementById(coData[coId].id).style = `position: absolute; left: ${coData[coId].initialCoordLeft}; top: ${coData[coId].initialCoordTop}};visibility: visible`;
    document.getElementById(coData[coId].spanId).innerHTML=`<p>x: ${data[coData[coId].index].xi.toFixed(2)}</p> <p>y: ${data[coData[coId].index].yi.toFixed(2)}</p>`;
    // document.getElementById(coData[coId].spanId).style.width = `${coData[coId].initialWidth}`;
    document.getElementById(coData[coId].spanId).style.visibility = 'visible';
  } else if (allSet === true){
    document.getElementById(coData[coId].id).style = `position: absolute; left: ${coData[coId].finalCoordLeft}; top: ${coData[coId].finalCoordTop}};visibility: visible`;
    document.getElementById(coData[coId].spanId).innerHTML=`<p>x: ${data[coData[coId].index].x.toFixed(2)}</p> <p>y: ${data[coData[coId].index].y.toFixed(2)}</p>`;
    // document.getElementById(coData[coId].spanId).style.width = `${coData[coId].finalWidth}`;
    document.getElementById(coData[coId].spanId).style.visibility = 'visible';
  }
  
}


function setZindex(){
  if(document.getElementById("coordinatePopup").style.zIndex === "100"){
    document.getElementById("coordinatePopup").style.zIndex = "-2";  
  } else if( document.getElementById("coordinatePopup").style.zIndex ==="-2") {
    document.getElementById("coordinatePopup").style.zIndex = "100";  
  }  
  document.getElementById("zmId").disabled = true;
}

function resetZoom(){
  var zoombox = "#"+$('#reset').parent().attr("id")+" .zoombox";
  $(zoombox+" img").css({"left":0, "top":0, "width":$(zoombox).width(), "height":$(zoombox).height()});
  document.getElementById("coordinatePopup").style.zIndex = "100";  
  document.getElementById("zmId").disabled = false;
  setImage();
}

function generalInstructions(){
  document.getElementById("tooltiptext").style.visibility = "visible"
  document.getElementById("tooltiptext").innerHTML = `
    <p>Click on <button class="buttonStyle1"></button> to zoom in by selecting area in the map.</p>
    <p>Click on <button class="buttonStyle2"></button> to reset map and enable coordinates view.</p>
    <p>Go to settings: Control Points.</p>
  `;
}


function hideGeneralInstructions(){
  document.getElementById("tooltiptext").style.visibility = "hidden";
}

function messagePopup(text){
  document.getElementById("notify").innerHTML = text;
  document.getElementById("notify").style.animation= '';
  document.getElementById("notify").style.animation = 'animOpacity 2s forwards';
  if(inference == 1){
    setTimeout(function(){
      document.getElementById("notify").innerHTML = "INFERENCE: Georeferencing is a method by which mere images like maps or aerial photos can be easily related to the actual ground system of geographic coordinates for use in a variety of circumstances.";
      setTimeout(function(){
        document.getElementById("notify").style.visibility = 'hidden';
      },2500);
    },2100);
  }
}

