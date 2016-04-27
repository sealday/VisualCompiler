(function(){
    "use strict";
    
    const width = 960,
        height = 200,
        duration = 1500;

    let svg = d3.select("svg#big-show")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(32, ${height / 2})`);

    function update(data) {

        // DATA JOIN
        // Join new data with old elements, if any.
        var text = svg.selectAll("text")
            .data(data, function(d) { return d.status; });

        // UPDATE
        // Update old elements as needed.
        text.attr("class", "update")
            .transition()
            .duration(duration)
            .attr("x", function(d, i) { return i * 64; });

        // ENTER
        // Create new elements as needed.
        text.enter().append("text")
            .attr("class", "enter")
            .attr("dy", ".35em")
            .attr("y", -60)
            .attr("x", function(d, i) { return i * 64; })
            .style("fill-opacity", 1e-6)
            .text(function(d) { return d.note; })
            .transition()
            .duration(duration)
            .attr("y", 0)
            .style("fill-opacity", 1);

        // EXIT
        // Remove old elements as needed.
        text.exit()
            .attr("class", "exit")
            .transition()
            .duration(duration)
            .attr("y", 60)
            .style("fill-opacity", 1e-6)
            .remove();
    }

    let my_array = [];


    my_array[0] = {
        head: "S",
        body: [["A", "a"], ["b"]],
        status: 0
    };
    
    my_array[1] = {
        head: "S",
        body: [["A", "a"], ["b"]],
        status: 1
    };


    let count = 0;
    // The initial display.
    update(my_array[count++]);
   
    // let nextBtn = document.querySelector("#next");
    // nextBtn.addEventListener("click", ()=>{
    //     update(my_array[count++ % 4].slice());
    //     nextBtn.setAttribute("disabled", "disabled");
    //     setTimeout(()=>{
    //         nextBtn.removeAttribute("disabled");
    //     }, duration);
    // }, false)
})();
