function linkingSelect(clicktarget) {
    let list = []
    let x1 = parseFloat(d3.select('#box')
        .attr('x'))
    let x2 = x1 + parseFloat(d3.select('#box')
        .attr('width'))
    let y1 = parseFloat(d3.select('#box')
        .attr('y'))
    let y2 = y1 + parseFloat(d3.select('#box')
        .attr('height'))
    if (d3.select('#box').attr('width') == 0) {
        x1 = 0
        x2 = 1e9
        y1 = 0
        y2 = 1e9
        if (clicktarget != 'rect') {
        	d3.selectAll('.basepart')
        		.classed('active', true)
        		.attr('opacity', 1)
        }
    }

    d3.selectAll('.basepart')
        ._groups[0]
        .forEach(d => {
            if (d3.select(d).classed('active'))
                //这里也有个slice
                // loc = d3.select(d).attr('class').indexOf(" ")
                list.push(d3.select(d).attr('class').slice(0, 2))
                // let temp = d3.select(d).attr('class')
                // list.push(temp.slice(0,temp.indexOf(" ")))
        })

    let constrain = ""
    if (list.length == 2){
    	constrain = list[0];
    }

    d3.selectAll('.point')
        .attr('fill-opacity', 0.3)
    for (let i = 0; i < list.length; i++) {
        d3.selectAll('.point.' + list[i])
            .attr('fill-opacity', function(d) {
                let x = d3.select(this)
                    .attr('cx')
                let y = d3.select(this)
                    .attr('cy')
                if (checkin(x, x1, x2) && checkin(y, y1, y2)) {
                    return 1
                }
                return 0.3
            })
    }

    let classArr = []
    let dict = {}
    var key
    d3.selectAll('.rect')
        ._groups[0]
        .forEach(d => {
            //这里也有个slice
            // loc = d3.select(d).attr('class').indexOf(" ")
            classArr.push(d3.select(d).attr('class').slice(0, 2))
            // let temp = d3.select(d).attr('class')
            // classArr.push(temp.slice(0,temp.indexOf(" ")))
        })
    for (let i =0;i<classArr.length;i++){
    	dict[classArr[i]] = 0
    }
    d3.selectAll('.point')
        ._groups[0]
        .forEach(d => {
            if (d3.select(d).attr('fill-opacity') == 1) {
                let value = parseFloat(d3.select(d)._groups[0][0].__data__.val)
                //这里slice本来是0-2，由于国家名字大于2个 所以改为0-3
                // loc = d3.select(d).attr('class').indexOf(" ")
                key = d3.select(d).attr('class').slice(0, 2)
                // let temp = d3.select(d).attr('class')
                // key = temp.slice(0,temp.indexOf(" "))
                if (key in dict) {
                    dict[key] += value
                } else {
                    dict[key] = value
                }
            }
        })

    var height
    var y
    for (key in dict) {
        height = parseFloat(d3.select('.rect.'+ key + '.basepart')
            .attr('height'))
        y = parseFloat(d3.select('.rect.'+ key + '.basepart')
            .attr('y'))
        d3.select('.rect.'+ key + '.basepart')
        	.attr('fill-opacity', 0.3)
        d3.select('.rect.'+key+'.highpart')
            .attr('height', function(d) {
                return height * dict[key] / d
            })
            .attr('y', function(d) {
                return y + (height - height * dict[key] / d)
            })
            .attr('opacity', function(d) {
            	if (constrain != "" && key != constrain)
            		return 0.3;
            	return 1
            })
    }
}

function linkingHover(target, constrain) {
    if (target == '.point') {
        d3.selectAll(target + constrain)
            .attr('stroke', '#ff6a33')
        let height = parseFloat(d3.select('.rect' + constrain+'.basepart')
            .attr('height'))
        let y = parseFloat(d3.select('rect' + constrain+'.basepart')
            .attr('y'))
        let width = parseFloat(d3.select('rect' + constrain+'.basepart')
       		.attr('width'))
       	let x = parseFloat(d3.select('rect' + constrain+'.basepart')
       		.attr('x'))
        d3.select('#barSvg')
        	.append('path')
        	.attr('stroke', '#ff6a33')
        	.attr('stroke-width', 2)
        	.attr('fill', 'none')
        	.attr('class', 'hoverline')
        	.attr('d', function(){
        		return "M"+x+","+y+
        		"L"+(x+width)+","+y+
        		"L"+(x+width)+","+(y+height)+
        		"L"+(x)+","+(y+height)+
        		"L"+x+","+y
        	})
    }
    if (target == '.rect') {
    	let value = parseFloat(d3.select(target + constrain[0])._groups[0][0].__data__)
        let height = parseFloat(d3.select(target + constrain[0])
            .attr('height'))
        let y = parseFloat(d3.select(target + constrain[0])
            .attr('y'))
       	let width = parseFloat(d3.select(target + constrain[0])
       		.attr('width'))
       	let x = parseFloat(d3.select(target + constrain[0])
       		.attr('x'))
       	constrain[1] = parseFloat(constrain[1])
        d3.select('.hoverpart')
            .attr('y', function() {
                return y + (height - height * constrain[1]/ value)
            })
            .attr('x', x)
            .attr('width', width)
            .attr('height', 0)
        d3.select('.hoverpart')
            .attr('height', function() {
                return height*constrain[1] / value
            })
            .transition()
            .duration(500)
            
    }
    if (target == '.point2') {
        test= target + constrain
        d3.selectAll(target + constrain)
            .attr('stroke', '#ff6a33')
        let height = parseFloat(d3.select('.rect' + constrain+'.basepart')
            .attr('height'))
        let y = parseFloat(d3.select('rect' + constrain+'.basepart')
            .attr('y'))
        let width = parseFloat(d3.select('rect' + constrain+'.basepart')
       		.attr('width'))
       	let x = parseFloat(d3.select('rect' + constrain+'.basepart')
               .attr('x'))
        // 给barchart加轮廓
        d3.select('#barSvg2')
        	.append('path')
        	.attr('stroke', '#ff6a33')
        	.attr('stroke-width', 2)
        	.attr('fill', 'none')
        	.attr('class', 'hoverline')
        	.attr('d', function(){
        		return "M"+x+","+y+
        		"L"+(x+width)+","+y+
        		"L"+(x+width)+","+(y+height)+
        		"L"+(x)+","+(y+height)+
        		"L"+x+","+y
        	})
    }
}

function Renew() {
    d3.selectAll('.point')
        .attr('stroke', 'none')
    d3.select('.hoverline')
    	.remove()
    d3.selectAll('.hoverpart')
    	.attr('height', 0)
    	.transition()
    	.duration(500)
}

function checkin(x, a, b) {
    return ((x - a) * (x - b) <= 0)
}