function draw_calendar(team){

    var width = 960,
        height = 136,
        cellSize = 17;

    var parseY = d3.timeParse("%Y%m%d");
    var formatY = d3.timeFormat("%Y");

    d3.csv("dist/data/"+team+".csv", function(error, csv) {

      var date_min = d3.min(csv, function(d){ return formatY(parseY(d.game_dt)); 	})
      var date_max = d3.max(csv, function(d){ return formatY(parseY(d.game_dt))	})
      var max = d3.max(csv, function(d) { return +d.s; });
      var min = d3.min(csv, function(d) { return +d.s; });

      var color = d3.scaleQuantile()
          .domain([min,max])
          .range(["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]);


      var svg = d3.select(".viz")
        .selectAll("svg")
        .data(d3.range(date_min, parseInt(date_max)+1))
        .enter().append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

      svg.append("text")
          .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
          .attr("font-family", "sans-serif")
          .attr("font-size", 16)
          .attr("text-anchor", "middle")
          .text(function(d) { return d; });

      var rect = svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "#ccc")
        .selectAll("rect")
        .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
          .attr("y", function(d) { return d.getDay() * cellSize; })
          .datum(d3.timeFormat("%Y%m%d"));

      svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "#000")
        .selectAll("path")
        .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
          .attr("d", pathMonth);

        if (error) throw error;

        var data = d3.nest()
            .key(function(d) { return d.game_dt; })
            .rollup(function(d) { return d })
          .object(csv);

        rect.filter(function(d) { return d in data; })
            .attr("fill", function(d) { return color(data[d][0].s); })
          .append("title")
            .text(function(d) { return d + ": " + data[d][0].s; });

      });

      function pathMonth(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
            d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
            + "H" + w0 * cellSize + "V" + 7 * cellSize
            + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
            + "H" + (w1 + 1) * cellSize + "V" + 0
            + "H" + (w0 + 1) * cellSize + "Z";
      }
}
