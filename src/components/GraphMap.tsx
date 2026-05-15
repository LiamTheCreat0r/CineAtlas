import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import type { GraphNode, GraphEdge } from '../types'
import { TMDB_IMAGE_BASE } from '../constants'

interface Props {
  nodes: GraphNode[]
  edges: GraphEdge[]
  frozen?: boolean
}

export default function GraphMap({ nodes, edges, frozen }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svgEl = svgRef.current
    const width = svgEl.clientWidth
    const height = svgEl.clientHeight

    const svg = d3.select(svgEl)
    svg.selectAll('*').remove()

    const g = svg.append('g')

    if (!frozen) {
      svg.call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.1, 4]).on('zoom', (event) => {
        g.attr('transform', event.transform)
      }) as any)
    }

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(130))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(70))

    const linkGroup = g.append('g')
    const nodeGroup = g.append('g')

    function tick() {
      linkGroup.selectAll<SVGLineElement, any>('line')
        .data(edges)
        .join('line')
        .attr('stroke', '#444')
        .attr('stroke-width', 1.5)
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      linkGroup.selectAll<SVGTextElement, any>('text')
        .data(edges)
        .join('text')
        .attr('fill', '#666')
        .attr('font-size', 10)
        .attr('text-anchor', 'middle')
        .text('appeared in')
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 8)

      const nodeSel = nodeGroup.selectAll<SVGGElement, any>('g')
        .data(nodes)
        .join('g')
        .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)

      nodeSel.selectAll<SVGImageElement, any>('image')
        .data((d: any) => [d])
        .join('image')
        .attr('href', (d: any) => {
          const path = d.type === 'film' ? d.posterPath : null
          return path ? `${TMDB_IMAGE_BASE}${path}` : ''
        })
        .attr('width', (d: any) => d.type === 'film' ? 50 : 40)
        .attr('height', (d: any) => d.type === 'film' ? 75 : 40)
        .attr('x', (d: any) => d.type === 'film' ? -25 : -20)
        .attr('y', (d: any) => d.type === 'film' ? -37 : -20)
        .attr('clip-path', (d: any) => d.type === 'actor' ? 'circle(20px)' : '')

      nodeSel.selectAll<SVGCircleElement, any>('circle.clip')
        .data((d: any) => d.type === 'actor' ? [d] : [])
        .join('circle')
        .attr('class', 'clip')
        .attr('r', 20)
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-width', 2)

      nodeSel.selectAll<SVGTextElement, any>('text')
        .data((d: any) => [d])
        .join('text')
        .attr('fill', '#ccc')
        .attr('font-size', 11)
        .attr('text-anchor', 'middle')
        .attr('y', (d: any) => (d.type === 'film' ? 50 : 30))
        .text((d: any) => d.label.length > 18 ? d.label.slice(0, 17) + '…' : d.label)

      if (!frozen) {
        nodeSel.call(d3.drag<SVGGElement, any>()
          .on('start', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d: any) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          }) as any)
      }
    }

    simulation.on('tick', tick)

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, frozen])

  return (
    <svg ref={svgRef} className="w-full h-full bg-neutral-950" />
  )
}
