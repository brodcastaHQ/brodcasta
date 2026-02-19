import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const Chart = ({ type, data, labels, height = 300, width = null }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current || !data || !labels) return;

        const container = containerRef.current;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const containerWidth = container?.offsetWidth || 600;
        const chartWidth = width || containerWidth;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const innerWidth = chartWidth - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        if (type === 'bar') {
            const xScale = d3.scaleBand()
                .domain(labels)
                .range([0, innerWidth])
                .padding(0.1);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .nice()
                .range([innerHeight, 0]);

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Add grid lines
            g.append('g')
                .attr('class', 'grid')
                .attr('transform', `translate(0,${innerHeight})`)
                .call(d3.axisBottom(xScale)
                    .tickSize(-innerHeight)
                    .tickFormat('')
                )
                .style('stroke-dasharray', '3,3')
                .style('opacity', 0.3);

            g.append('g')
                .attr('class', 'grid')
                .call(d3.axisLeft(yScale)
                    .tickSize(-innerWidth)
                    .tickFormat('')
                )
                .style('stroke-dasharray', '3,3')
                .style('opacity', 0.3);

            // Add bars with animation
            const bars = g.selectAll('.bar')
                .data(data)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', (d, i) => xScale(labels[i]))
                .attr('width', xScale.bandwidth())
                .attr('y', innerHeight)
                .attr('height', 0)
                .attr('fill', '#3b82f6')
                .attr('rx', 4)
                .style('cursor', 'pointer')
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('fill', '#2563eb');
                    
                    // Show tooltip
                    const tooltip = d3.select('body').append('div')
                        .attr('class', 'tooltip')
                        .style('position', 'absolute')
                        .style('background', '#1f2937')
                        .style('color', 'white')
                        .style('padding', '8px')
                        .style('border-radius', '4px')
                        .style('font-size', '12px')
                        .style('pointer-events', 'none')
                        .style('opacity', 0);
                    
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', 1);
                    
                    tooltip.html(`Value: ${d}`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('fill', '#3b82f6');
                    
                    d3.selectAll('.tooltip').remove();
                });

            // Animate bars
            bars.transition()
                .duration(800)
                .delay((d, i) => i * 50)
                .attr('y', d => yScale(d))
                .attr('height', d => innerHeight - yScale(d));

            // Add x-axis
            g.append('g')
                .attr('transform', `translate(0,${innerHeight})`)
                .call(d3.axisBottom(xScale))
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '.15em')
                .attr('transform', 'rotate(-45)');

            // Add y-axis
            g.append('g')
                .call(d3.axisLeft(yScale).ticks(5));
        }

        if (type === 'line') {
            const xScale = d3.scaleLinear()
                .domain([0, labels.length - 1])
                .range([0, innerWidth]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .nice()
                .range([innerHeight, 0]);

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Add grid
            g.append('g')
                .attr('class', 'grid')
                .call(d3.axisLeft(yScale)
                    .tickSize(-innerWidth)
                    .tickFormat('')
                )
                .style('stroke-dasharray', '3,3')
                .style('opacity', 0.3);

            // Create line generator
            const line = d3.line()
                .x((d, i) => xScale(i))
                .y(d => yScale(d))
                .curve(d3.curveMonotoneX);

            // Add area under line
            const area = d3.area()
                .x((d, i) => xScale(i))
                .y0(innerHeight)
                .y1(d => yScale(d))
                .curve(d3.curveMonotoneX);

            // Add area
            g.append('path')
                .datum(data)
                .attr('fill', '#3b82f6')
                .attr('fill-opacity', 0.1)
                .attr('d', area);

            // Add line
            const path = g.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', '#3b82f6')
                .attr('stroke-width', 3)
                .attr('d', line);

            // Animate line drawing
            const totalLength = path.node().getTotalLength();
            path
                .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(1500)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);

            // Add dots
            g.selectAll('.dot')
                .data(data)
                .enter().append('circle')
                .attr('class', 'dot')
                .attr('cx', (d, i) => xScale(i))
                .attr('cy', d => yScale(d))
                .attr('r', 0)
                .attr('fill', '#3b82f6')
                .style('cursor', 'pointer')
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('r', 6);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('r', 4);
                })
                .transition()
                .duration(800)
                .delay((d, i) => i * 100)
                .attr('r', 4);

            // Add x-axis
            g.append('g')
                .attr('transform', `translate(0,${innerHeight})`)
                .call(d3.axisBottom(xScale).tickFormat(i => labels[i] || ''));

            // Add y-axis
            g.append('g')
                .call(d3.axisLeft(yScale).ticks(5));
        }

        if (type === 'pie') {
            const radius = Math.min(innerWidth, innerHeight) / 2;
            const color = d3.scaleOrdinal(['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']);

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left + innerWidth/2},${margin.top + innerHeight/2})`);

            const pie = d3.pie()
                .value(d => d)
                .sort(null);

            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            const arcHover = d3.arc()
                .innerRadius(0)
                .outerRadius(radius * 1.1);

            const arcs = g.selectAll('.arc')
                .data(pie(data))
                .enter().append('g')
                .attr('class', 'arc');

            arcs.append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => color(i))
                .style('cursor', 'pointer')
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('d', arcHover);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('d', arc);
                });

            // Add labels
            arcs.append('text')
                .attr('transform', d => `translate(${arc.centroid(d)})`)
                .attr('text-anchor', 'middle')
                .style('fill', 'white')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text(d => {
                    const percentage = ((d.data / data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                    return percentage > 5 ? `${percentage}%` : '';
                });
        }

    }, [type, data, labels, height, width]);

    return (
        <div ref={containerRef} className="w-full">
            <svg
                ref={svgRef}
                width="100%"
                height={height}
                viewBox={`0 0 ${width || 600} ${height}`}
                preserveAspectRatio="xMidYMid meet"
            />
        </div>
    );
};

export default Chart;
