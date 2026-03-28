import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const palette = ['#22d3ee', '#22c55e', '#38bdf8', '#f59e0b', '#fb7185'];
const axisColor = '#94a3b8';
const gridColor = 'rgba(148, 163, 184, 0.14)';
const tooltipBackground = 'rgba(8, 17, 32, 0.96)';

const sumValues = (values) => values.reduce((total, value) => total + value, 0);

const Chart = ({ type, data = [], labels = [], height = 280, width = null }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !data.length || !labels.length) return;

    const container = containerRef.current;
    const containerWidth = width || container?.offsetWidth || 640;
    const margin = { top: 16, right: 20, bottom: 36, left: 42 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('padding', '8px 10px')
      .style('border-radius', '12px')
      .style('border', '1px solid rgba(148, 163, 184, 0.18)')
      .style('background', tooltipBackground)
      .style('box-shadow', '0 18px 40px rgba(2, 6, 23, 0.4)')
      .style('color', '#f8fafc')
      .style('font-size', '12px')
      .style('font-family', '"IBM Plex Sans", sans-serif');

    const chart = svg
      .attr('viewBox', `0 0 ${containerWidth} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const showTooltip = (event, label, value) => {
      tooltip
        .style('opacity', 1)
        .html(`<strong>${label}</strong><br/>${value}`)
        .style('left', `${event.pageX + 12}px`)
        .style('top', `${event.pageY - 28}px`);
    };

    const hideTooltip = () => {
      tooltip.style('opacity', 0);
    };

    if (type === 'bar') {
      const entries = data.map((value, index) => ({ value, label: labels[index] }));
      const x = d3.scaleBand().domain(labels).range([0, innerWidth]).padding(0.18);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data) || 0])
        .nice()
        .range([innerHeight, 0]);

      chart
        .append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).ticks(4).tickSize(-innerWidth).tickFormat(''))
        .selectAll('line')
        .attr('stroke', gridColor);

      chart
        .append('g')
        .selectAll('rect')
        .data(entries)
        .join('rect')
        .attr('x', (entry) => x(entry.label))
        .attr('y', innerHeight)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('rx', 12)
        .attr('fill', palette[0])
        .on('mouseenter', function (event, entry) {
          d3.select(this).attr('fill', '#67e8f9');
          showTooltip(event, entry.label, entry.value);
        })
        .on('mousemove', function (event, entry) {
          showTooltip(event, entry.label, entry.value);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('fill', palette[0]);
          hideTooltip();
        })
        .transition()
        .duration(500)
        .ease(d3.easeCubicOut)
        .attr('y', (entry) => y(entry.value))
        .attr('height', (entry) => innerHeight - y(entry.value));

      chart
        .append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x))
        .call((group) => group.selectAll('text').attr('fill', axisColor).style('font-size', '11px'))
        .call((group) => group.selectAll('path, line').attr('stroke', 'rgba(148, 163, 184, 0.24)'));

      chart
        .append('g')
        .call(d3.axisLeft(y).ticks(4))
        .call((group) => group.selectAll('text').attr('fill', axisColor).style('font-size', '11px'))
        .call((group) => group.selectAll('path, line').attr('stroke', 'rgba(148, 163, 184, 0.24)'));
    }

    if (type === 'line') {
      const entries = data.map((value, index) => ({ value, label: labels[index] }));
      const x = d3.scalePoint().domain(labels).range([0, innerWidth]).padding(0.5);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data) || 0])
        .nice()
        .range([innerHeight, 0]);

      chart
        .append('g')
        .call(d3.axisLeft(y).ticks(4).tickSize(-innerWidth).tickFormat(''))
        .selectAll('line')
        .attr('stroke', gridColor);

      const area = d3
        .area()
        .x((entry) => x(entry.label))
        .y0(innerHeight)
        .y1((entry) => y(entry.value))
        .curve(d3.curveMonotoneX);

      const line = d3
        .line()
        .x((entry) => x(entry.label))
        .y((entry) => y(entry.value))
        .curve(d3.curveMonotoneX);

      chart
        .append('path')
        .datum(entries)
        .attr('fill', 'rgba(34, 211, 238, 0.12)')
        .attr('d', area);

      const linePath = chart
        .append('path')
        .datum(entries)
        .attr('fill', 'none')
        .attr('stroke', palette[0])
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', line);

      const totalLength = linePath.node().getTotalLength();
      linePath
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(700)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);

      chart
        .selectAll('circle')
        .data(entries)
        .join('circle')
        .attr('cx', (entry) => x(entry.label))
        .attr('cy', (entry) => y(entry.value))
        .attr('r', 0)
        .attr('fill', '#07111f')
        .attr('stroke', '#67e8f9')
        .attr('stroke-width', 2)
        .on('mouseenter', function (event, entry) {
          d3.select(this).attr('r', 7);
          showTooltip(event, entry.label, entry.value);
        })
        .on('mousemove', function (event, entry) {
          showTooltip(event, entry.label, entry.value);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('r', 5);
          hideTooltip();
        })
        .transition()
        .duration(500)
        .ease(d3.easeCubicOut)
        .attr('r', 5);

      chart
        .append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x))
        .call((group) => group.selectAll('text').attr('fill', axisColor).style('font-size', '11px'))
        .call((group) => group.selectAll('path, line').attr('stroke', 'rgba(148, 163, 184, 0.24)'));

      chart
        .append('g')
        .call(d3.axisLeft(y).ticks(4))
        .call((group) => group.selectAll('text').attr('fill', axisColor).style('font-size', '11px'))
        .call((group) => group.selectAll('path, line').attr('stroke', 'rgba(148, 163, 184, 0.24)'));
    }

    if (type === 'pie') {
      const radius = Math.min(innerWidth, innerHeight) / 2;
      const pie = d3.pie().value((value) => value).sort(null);
      const arc = d3.arc().innerRadius(radius * 0.45).outerRadius(radius);
      const hoverArc = d3.arc().innerRadius(radius * 0.45).outerRadius(radius + 6);
      const slices = pie(data);
      const total = sumValues(data);

      const group = chart
        .append('g')
        .attr('transform', `translate(${innerWidth / 2}, ${innerHeight / 2})`);

      group
        .selectAll('path')
        .data(slices)
        .join('path')
        .attr('fill', (_, index) => palette[index % palette.length])
        .attr('d', arc)
        .attr('stroke', '#07111f')
        .attr('stroke-width', 2)
        .on('mouseenter', function (event, slice) {
          d3.select(this).attr('d', hoverArc);
          showTooltip(event, labels[slice.index], slice.data);
        })
        .on('mousemove', function (event, slice) {
          showTooltip(event, labels[slice.index], slice.data);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('d', arc);
          hideTooltip();
        });

      group
        .selectAll('text')
        .data(slices)
        .join('text')
        .attr('transform', (slice) => `translate(${arc.centroid(slice)})`)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#f8fafc')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .text((slice) => {
          const percentage = total ? Math.round((slice.data / total) * 100) : 0;
          return percentage > 6 ? `${percentage}%` : '';
        });
    }

    return () => {
      tooltip.remove();
    };
  }, [data, height, labels, type, width]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} />
    </div>
  );
};

export default Chart;
