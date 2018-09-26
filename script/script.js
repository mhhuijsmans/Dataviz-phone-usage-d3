//-----------------//
//    VARIABLES    //
//-----------------//
var svgwidth = 300;
var svgheight = 638;
var radius = Math.min(svgwidth, svgheight) / 2.5;
var donutWidth = 40;
var donutOffset = 30;
var legendRectSize = 18;
var legendSpacing = 8;
var calendarRectSize = 26;
var calendarSpacing = 1;
var timelineHeight = 75;
var barHeight = 50;
var stripeHeight = 40;
var timelineDivider = 2.5;
var stripeMinWidth = 1;
var color = d3.scale.ordinal().range([
"#8dd3c7",
"#ffffb3",
"#bebada",
"#fb8072",
"#80b1d3",
"#fdb462",
"#b3de69",
"#fccde5",
"#d9d9d9",
"#bc80bd"
]);
var days = ['Ma','Di','Wo','Do','Vr','Za','Zo'];

//-----------------//
//    BUILD SVG    //
//-----------------//
var svg = d3.select('.dashboard')
    .append('svg')
    .attr('id', 'donut')
    .attr('width', svgwidth)
    .attr('height', svgheight)

var groupdonut1 = d3.select('#donut')
    .append('g')
    .attr('class', 'donut donut1')
    .attr('transform', 'translate(' + (svgwidth / 2) +  ',190)');

groupdonut1
    .append('text')
    .text('HOE LANG GEBRUIKT?')
    .attr('class', 'h3')
    .attr('transform', 'translate(0,-' + (radius + 20) + ')');

var groupdonut2 = d3.select('#donut')
    .append('g')
    .attr('class', 'donut donut2')
    .attr('transform', 'translate(' + (svgwidth / 2) +  ',500)');

groupdonut2
    .append('text')
    .text('HOE VAAK GEBRUIKT?')
    .attr('class', 'h3')
    .attr('transform', 'translate(0,-' + (radius + 20) + ')');



var svg2 = d3.select('.dashboard')
    .append('svg')
    .attr('id', 'timeline')
    .attr('width', '756px')
    .attr('height', svgheight);


var map = d3.select('.dashboard')
    .append('div')
    .attr('id', 'map')
    .attr('class' ,'hide');

map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 8,
  center: new google.maps.LatLng(52.2960624, 4.6697),
  mapTypeId: google.maps.MapTypeId.TERRAIN
});



//-----------------//
//   PIE ELEMENTS  //
//-----------------//
var arc = d3.svg.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

var pie = d3.layout.pie()
    .value(function(d) { return d.seconds; });




d3.csv('data.csv', function(error, data){
d3.csv('ov.csv', function(overror, ovdata){

    data.forEach(function(d){
        d.week = new Date(d.datum).getWeek();
    });

            
    ovdata.forEach(function(d){
        d.week = new Date(d.datum).getWeek();
    });



    //-------------------------//
    //   MAKE LEGEND DATASET   //
    //-------------------------//
    var datasetlegend = d3.nest()
        .key(function(d){
            return d.appname;
        })
        .sortKeys(d3.ascending)
        .entries(data);

    datasetlegend.forEach(function(d){
        d.appname = d.key;
    });


    //-------------------------//
    //  MAKE CALENDAR DATASET  //
    //-------------------------//
    var datasetcalendar = d3.nest()
        .key(function(d){
            return d.week;
        })
        .key(function(d){
            return d.datum;
        })
        .entries(data);


    //-----------------//
    //   BUILD LEGEND  //
    //-----------------//
    var grouplegend = d3.select('svg#phone')
        .append('g')
        .attr('class','grouplegend')

    grouplegend
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'kop')
        .text('Apps');

    var legend = grouplegend.selectAll('.legend')
        .data(pie(datasetlegend))
        .enter()
        .append('g')
        .attr('id', function(d, i) {
            return 'legend-' + d.data.appname;
        })
        .attr('class', function(d, i) {
            return 'legend is-active ' + d.data.appname;
        })
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = 25;
            var horz = (i < Math.floor(datasetlegend.length / 2)) ? 0 : 130;
            var vert = (i < Math.floor(datasetlegend.length / 2)) ? i * height + offset : (i - Math.ceil(datasetlegend.length / 2)) * height + offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend
        .append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)    
        /*.attr('fill', function(d, i) {
            return color(d.data.appname);
        })*/
        .style('stroke', '#fff');

    legend
        .append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d.data.appname; });


    //-----------------//
    //  BUILD CALENDAR //
    //-----------------//
    var groupcalendar = d3.select('svg#phone')
        .append('g')
        .attr('class','groupcalendar')

    groupcalendar
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'kop')
        .text('Week');

    var weekpicker = d3.select('.groupcalendar')
        .append('g')
        .attr('class', 'weekpicker')

    weekpicker
        .append('rect')
        .attr('fill','#ff0000')
        .attr('width',calendarRectSize * 3.1)
        .attr('height',calendarRectSize);

    weekpicker
        .append('text')
        .attr('x', 5)
        .attr('y', legendRectSize - 5)
        .text('Kies week ▾');


    var calendarweek = groupcalendar.selectAll('.weekno')
        .data(pie(datasetcalendar))
        .enter()
        .append('g')
        .attr('class', function(d){
            return 'weekno week' + d.data.key;
        })
        .attr('transform', function(d, i) {
            var width = calendarRectSize + calendarSpacing;
            var height = calendarRectSize + calendarSpacing;
            var offset = 15;
            var horz = 0;
            var vert = height * (i + 1) + offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    calendarweek
        .append('rect')
        .attr('fill','#ff0000')
        .attr('width',calendarRectSize * 3.1)
        .attr('height',calendarRectSize);

    calendarweek
        .append('text')
        .attr('x', 5)
        .attr('y', legendRectSize - 5)
        .text(function(d) { return 'Week ' + d.data.key; });


    //-----------------//
    // BUILD TABTOGGLE //
    //-----------------//
    var grouptabtoggle = d3.select('svg#phone')
        .append('g')
        .attr('class','grouptabtoggle');

    grouptabtoggle
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'kop')
        .text('Bekijk wanneer/waar');
    
    var togglewanneer = grouptabtoggle
        .append('g')
        .attr('class','togglewanneer is-active')
        .attr('transform','translate(7,32)');
    
    togglewanneer
        .append('circle')
        .attr('r', 6)
        .attr('transform','translate(0,0)');
    
    togglewanneer
        .append('text')
        .attr('x', 15)
        .attr('y', 0)
        .text('Wanneer');
    
    
    var togglewanneer = grouptabtoggle
        .append('g')
        .attr('class','togglewaar')
        .attr('transform','translate(110,32)');
    
    togglewanneer
        .append('circle')
        .attr('r', 6)
        .attr('transform','translate(0,0)');
    
    togglewanneer
        .append('text')
        .attr('x', 15)
        .attr('y', 0)
        .text('Waar');
    

    $('.togglewanneer').click(function(event){
        $('.togglewaar').removeClass('is-active');
        $(event.target).parent().addClass('is-active');
        
        $('#timeline').removeClass('hide');
        $('#map').addClass('hide');
    });
    
    $('.togglewaar').click(function(event){
        $('.togglewanneer').removeClass('is-active');
        $(event.target).parent().addClass('is-active');
        
        $('#map').removeClass('hide');
        $('#timeline').addClass('hide');
    });
    

    //-----------------//
    //   SELECT APPS   //
    //-----------------//
    $( '#phone' ).find('g.legend').click(function() {
        var target = $(this)[0];
        target.classList.toggle('is-active');
        updater();
    });


    //-----------------//
    //   SELECT WEEK   //
    //-----------------//
    $( '#phone' ).find('g.weekpicker').click(function( event ) {
        var target = $(this)[0];
        target.classList.toggle('is-active');
    });

    var weekno;
    $( '#phone' ).find('g.weekno').click(function() {
        var target = $(this);
        var newtext = target.find('text')[0].innerHTML;
        weekno = newtext.match(/\d+/)[0];
        $( '#phone' ).find('g.weekpicker text')[0].textContent = newtext + ' ▾';
        $( '#phone' ).find('g.weekpicker')[0].classList.toggle('is-active');
        $('.fire').addClass('ready-to-fire');
        updater();
    });


    //-----------------//
    //   THE UPDATER   //
    //-----------------//
    function updater() {
        //-----------------//
        //    DO FILTER    //
        //-----------------//
        var legend = $('#phone').find('g.legend');
        var activeApps = new Array;
        legend.each(function(i){
            if (legend[i].classList.contains('is-active')) {
                activeApps.push(legend[i].id.replace('legend-',''));
            }
        });

        //Filter pie 1
        var dataset1totaal = 0;
        var dataset1 = data.filter(function(d){
            return d.week == weekno;
        });

        dataset1 = d3.nest()
            .key(function(d){
                return d.appname;
            })
            .rollup(function(d){
                return d3.sum(d, function(g) {return g.seconds;});
            })
            .sortKeys(d3.ascending)
            .entries(dataset1);

        dataset1.forEach(function(d){
            d.appname = d.key;
            d.seconds = d.values;
        });

        dataset1 = dataset1.filter(function(d, i){
            if (activeApps.indexOf(d.appname) != -1) {
                dataset1totaal += d.seconds;
                return d.appname;
            }
        });
        
        
        var datasetmap = data.filter(function(d){
            return d.week == weekno;
        });

        datasetmap = datasetmap.filter(function(d, i){
            if (activeApps.indexOf(d.appname) != -1) {
                return d.appname;
            }
        });
        


        //Filter pie 2
        var dataset2totaal = 0;
        var dataset2 = data.filter(function(d){
            return d.week == weekno;
        });

        dataset2 = d3.nest()
            .key(function(d){
                return d.appname;
            })
            .rollup(function(d){
                return d3.sum(d, function(g) {return 1;});
            })
            .sortKeys(d3.ascending)
            .entries(dataset2);

        dataset2.forEach(function(d){
            d.appname = d.key;
            d.seconds = d.values;
        });

        dataset2 = dataset2.filter(function(d, i){
            if (activeApps.indexOf(d.appname) != -1) {
                dataset2totaal += d.values;
                return d.appname;
            }
        });
        
        
        
        var datasetov = ovdata.filter(function(d){
            return d.week == weekno;
        });
        
        datasetov.forEach(function(d){
            d.startparse = Date.parse(d.vertrektijd);
            d.endparse = Date.parse(d.aankomsttijd);
            d.startdag = Date.parse(d.datum);
            d.minutes = (d.endparse - d.startparse) / 1000 / 60;
            d.minutesfromstart = (d.startparse - d.startdag) / 1000 / 60;
        });
        
        datasetov = d3.nest()
            .key(function(d){
                return d.datum;
            })
            .entries(datasetov);
        
        
        
        var datasetapptijd = data.filter(function(d){
            return d.week == weekno;
        });
        
        datasetapptijd.forEach(function(d){
            d.startparse = Date.parse(d.starttime);
            d.startdag = Date.parse(d.datum);
            d.minutes = d.seconds / 60;
            d.minutesfromstart = (d.startparse - d.startdag) / 1000 / 60;
        });
        
        datasetapptijd = d3.nest()
            .key(function(d){
                return d.datum;
            })
            .entries(datasetapptijd);
        
        
        

        //-----------------//
        //   BUILD CHARTS  //
        //-----------------//

        //pie 1-------------------------------
        groupdonut1.selectAll('g').remove();

        var path = groupdonut1.selectAll('path')
            .data(pie(dataset1));

        path.enter()
            .append('g')
            .attr('class', function(d) {
                return 'app-part ' + d.data.appname;
            })
            .append('path')
            .attr('d', arc)
            .attr('class', function(d, i) {
                return d.data.appname;
            })
            /*.attr('fill', function(d, i) {
                return color(d.data.appname);
            })*/;

        var pieparttext = groupdonut1.selectAll('.app-part');
        pieparttext
            .append('text')
            .attr('class', 'deel')
            .text(function(d) {
                  return d.data.appname + ': ' + timeCalc(d.data.seconds)
            })
            .style('fill', '#fff');

        pieparttext
            .append('text')
            .attr('class', 'percentage')
            .text(function(d) {
                return Math.round(d.data.seconds / dataset1totaal * 100) + '%';
            })
            .style('fill', '#fff');

        var info = d3.select('.donut1')
            .append('g')
            .attr('class', 'info')
            .append('text')
            .attr('class', 'totaal')
            .text('Totaal: ' + timeCalc(dataset1totaal))
            .style('fill', '#fff')


        //pie 2-------------------------------
        groupdonut2.selectAll('g').remove();

        var path2 = groupdonut2.selectAll('path')
            .data(pie(dataset2));

        path2.enter()
            .append('g')
            .attr('class', function(d) {
                return 'app-part ' + d.data.appname;
            })
            .append('path')
            .attr('d', arc)
            .attr('class', function(d, i) {
                return d.data.appname;
            })
            /*.attr('fill', function(d, i) {
                return color(d.data.appname);
            })*/;

        var pieparttext2 = groupdonut2.selectAll('.app-part');
        pieparttext2
            .append('text')
            .attr('class', 'deel')
            .text(function(d) {
                  return d.data.appname + ': ' + d.data.values + ' keer';
            })
            .style('fill', '#fff');

        pieparttext2
            .append('text')
            .attr('class', 'percentage')
            .text(function(d) {
                return Math.round(d.data.values / dataset2totaal * 100) + '%';
            })
            .style('fill', '#fff');

        var info2 = d3.select('.donut2')
            .append('g')
            .attr('class', 'info')
            .append('text')
            .attr('class', 'totaal')
            .text('Totaal: ' + dataset2totaal + ' keer')
            .style('fill', '#fff');
        
        
        //OV TIMELINE-------------------------------
        
        svg2.selectAll('g').remove();
        
        svg2
            .append('text')
            .text('WANNEER GEBRUIKT?')
            .attr('class', 'h3')
            .attr('transform', 'translate(20,50)');
        
        var timelinelegend = svg2
            .append('g')
            .attr('class','timelinelegend')
            .attr('transform', 'translate(475,30)');
        
        var leg1 = timelinelegend
            .append('g')
            .attr('class','timelinelegend opbestemming')
            .attr('transform', 'translate(0,0)');
        
        leg1
            .append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize);
        
        leg1
            .append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .attr('transform', 'translate(0,5)')
            .text('Op bestemming');
        
        var leg2 = timelinelegend
            .append('g')
            .attr('class','timelinelegend onderweg')
            .attr('transform', 'translate(150,0)');
        
        leg2
            .append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize);
        
        leg2
            .append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .attr('transform', 'translate(0,5)')
            .text('Onderweg');
            

        var dag = svg2.selectAll('.dag')
            .data(datasetov)
            .enter()
            .append('g')
            .attr('class', 'dag')
            .attr('transform', function(d, i){
                return 'translate(20,' + (timelineHeight * i + 80) + ')';
            });

        dag
            .append('text')
            .attr('class','datum')
            .attr('transform','translate(0,30)')
            .text(function(d, i){
                return days[i] + ', ' + d.key;
            });

        var dagbar = dag
            .append('g')
            .attr('class','ovbar')
            .attr('transform','translate(170,0)')

        dagbar.selectAll('.dagdeel')
            .data(function(d){
                return d.values;
            })
            .enter()
            .append('rect')
            .attr('class',function(d){
                return 'dagdeel ' + d.status.replace(/\s/,'');
            })
            .attr('x',function(d){
                return (d.minutesfromstart / timelineDivider)
            })
            .attr('y',0)
            .attr('height', barHeight)
            .attr('width',function(d){
                return (d.minutes / timelineDivider)
            });
        
        var dagdata = svg2.selectAll('.dag')
            .data(datasetapptijd)
            .append('g')
            .attr('class','appbar')
            .attr('transform','translate(170,0)')
        
        dagdata.selectAll('.app-part')
            .data(function(d){
                return d.values;
            })
            .enter()
            .append('rect')
            .attr('class',function(d){
                return 'app-part ' + d.appname;
            })
            .attr('x',function(d){
                return (d.minutesfromstart / timelineDivider)
            })
            .attr('y',5)
            .attr('height', stripeHeight)
            .attr('width',function(d){
                return (d.minutes / timelineDivider < stripeMinWidth) ? stripeMinWidth : d.minutes / timelineDivider
            })
            /*.attr('fill', function(d, i) {
                return color(d.appname);
            })*/;
        
        var x = d3.time.scale()
            .domain([new Date, new Date])
            .range([0, 576])
            .nice(d3.time.day);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(d3.time.hour, 2)
            .tickFormat(d3.time.format("%H:%M"));
        
        svg2
            .append('g')
            .attr('class','x axis')
            .attr('transform','translate(142,600)')
            .call(xAxis);
        
        $('#timeline rect.app-part').each(function(){
            if (activeApps.indexOf($(this)[0].classList[1]) == -1) {
                $(this)[0].classList.add('hide');
            }
            else {
                $(this)[0].classList.remove('hide');
            }
        });
        
        
        
        //MAP-------------------------------
        var overlay = new google.maps.OverlayView();

        overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayLayer).append("div")
            .attr("class", "markers");

            overlay.draw = function() {
                var projection = this.getProjection(),
                    padding = 10;
                
                
                d3.selectAll('svg.marker').remove();

                var marker = layer.selectAll("svg")
                    .data(d3.entries(datasetmap))
                    .each(transform)
                    .enter().append("svg")
                    .each(transform)
                    .attr("class", function(d){
                        return 'app-part ' + d.value.appname + ' marker';
                    });

                marker.append("circle")
                    .attr("r", 4.5)
                    .attr("cx", padding)
                    .attr("cy", padding);

                function transform(d) {
                    d = new google.maps.LatLng(d.value.lat, d.value.long);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left", (d.x - padding) + "px")
                        .style("top", (d.y - padding) + "px");
                }
            };
        };

        overlay.setMap(map);
        
        

        onHover();
    };


    $('.fire').click(function(){
        $('body').removeClass('is-landing');
        $('body').addClass('is-loaded');
    });

    updater();
//d3 closing
});
});






function timeCalc(totalSec) {
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;

    return hours + 'u ' + minutes + 'm ' + seconds + 's'
}

function onHover() {
    $('[class^="app-part"]').hover(
        function( event ){
            $('.donut').addClass('is-hovered');
            $('#timeline').addClass('is-hovered');
            $('.markers').addClass('is-hovered');
            var parent = $(event.target).parent()[0];
            if (parent.classList.contains('app-part')) {
                $('.app-part.' + event.target.closest('g').classList[1]).addClass('is-hovered');
            }
            else if ($(event.target)[0].classList.contains('app-part')) {
                $('.app-part.' + event.target.classList[1]).addClass('is-hovered');
            }
        },
        function( event ){
            $('.donut').removeClass('is-hovered');
            $('#timeline').removeClass('is-hovered');
            $('.markers').removeClass('is-hovered');
            $('.app-part').removeClass('is-hovered');
        }
    );
};
