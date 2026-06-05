'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Employee } from '@/types/peoplecore';
import { getInitials } from '@/lib/formatters';
import { Search, Download, ZoomIn, ZoomOut, RotateCcw, Minus, Plus } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

interface OrgNode {
  id: string;
  name: string;
  title: string;
  department: string;
  managerId: string | null;
  avatarUrl: string;
  children?: OrgNode[];
  childCount: number;
}

interface OrgChartD3Props {
  employees: Employee[];
}

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;
const H_GAP = 40;
const V_GAP = 60;

const AVATAR_COLORS: Record<string, { bg: string; color: string }> = {};
const PALETTES = [
  { bg: '#e5f6ee', color: '#138a5b' },
  { bg: '#e8f2fd', color: '#2f80ed' },
  { bg: '#fff4d8', color: '#d99a13' },
  { bg: '#f3ecfd', color: '#9b51e0' },
  { bg: '#fdeaea', color: '#d64545' },
];

function getAvatarColor(name: string) {
  if (!AVATAR_COLORS[name]) {
    let hash = 0;
    for (const c of name) hash = (hash + c.charCodeAt(0)) % PALETTES.length;
    AVATAR_COLORS[name] = PALETTES[hash];
  }
  return AVATAR_COLORS[name];
}

function buildTree(employees: Employee[]): OrgNode | null {
  const map: Record<string, OrgNode> = {};
  employees.forEach((e) => {
    map[e.id] = {
      id: e.id,
      name: e.fullName,
      title: e.jobTitle,
      department: e.department,
      managerId: e.managerId,
      avatarUrl: e.avatarUrl,
      childCount: 0,
    };
  });
  let root: OrgNode | null = null;
  employees.forEach((e) => {
    const node = map[e.id];
    if (!e.managerId) {
      root = node;
    } else if (map[e.managerId]) {
      const parent = map[e.managerId];
      parent.children = parent.children ?? [];
      parent.children.push(node);
      parent.childCount += 1;
    }
  });
  return root;
}

function filterCollapsedTree(node: OrgNode, collapsed: Set<string>, revealAll: boolean): OrgNode {
  return {
    ...node,
    children:
      collapsed.has(node.id) && !revealAll
        ? undefined
        : node.children?.map((child) => filterCollapsedTree(child, collapsed, revealAll)),
  };
}

export function OrgChartD3({ employees }: OrgChartD3Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const rootRef = useRef<d3.HierarchyPointNode<OrgNode> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const treeData = useMemo(() => buildTree(employees), [employees]);
  const managerIds = useMemo(
    () => new Set(employees.filter((employee) => employee.managerId).map((employee) => employee.managerId as string)),
    [employees]
  );

  const toggleNode = (id: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  function renderChart(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    layout: d3.HierarchyPointNode<OrgNode>,
    q: string
  ) {
    g.selectAll('*').remove();

    const links = layout.links();
    const nodes = layout.descendants();

    // Draw links
    g.selectAll('.org-chart-link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'org-chart-link')
      .attr('fill', 'none')
      .attr('stroke', '#dce8e2')
      .attr('stroke-width', 1.5)
      .attr('d', (d) => {
        const sx = d.source.x;
        const sy = d.source.y + NODE_HEIGHT / 2;
        const tx = d.target.x;
        const ty = d.target.y - NODE_HEIGHT / 2;
        const my = (sy + ty) / 2;
        return `M${sx},${sy} C${sx},${my} ${tx},${my} ${tx},${ty}`;
      });

    // Draw nodes
    const nodeG = g.selectAll('.org-chart-node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'org-chart-node')
      .attr('transform', (d) => `translate(${d.x - NODE_WIDTH / 2}, ${d.y - NODE_HEIGHT / 2})`)
      .style('cursor', (d) => (d.data.childCount > 0 ? 'pointer' : 'default'))
      .on('click', (_event, d) => {
        if (d.data.childCount > 0) toggleNode(d.data.id);
      });

    // Node card background
    nodeG.append('rect')
      .attr('width', NODE_WIDTH)
      .attr('height', NODE_HEIGHT)
      .attr('rx', 12)
      .attr('ry', 12)
      .style('fill', 'var(--card)')
      .style('stroke', (d) => {
        if (!q) return 'var(--border)';
        const match = d.data.name.toLowerCase().includes(q.toLowerCase());
        return match ? 'var(--primary)' : 'var(--border)';
      })
      .style('stroke-width', (d) => {
        if (!q) return 1.5;
        return d.data.name.toLowerCase().includes(q.toLowerCase()) ? 2.5 : 1.5;
      })
      .style('opacity', (d) => {
        if (!q) return 1;
        return d.data.name.toLowerCase().includes(q.toLowerCase()) ? 1 : 0.3;
      })
      .style('filter', 'drop-shadow(0 1px 4px rgba(16,32,26,0.07))');

    // Avatar circle
    const avatarSize = 32;
    const avatarX = 14;
    const avatarY = NODE_HEIGHT / 2 - avatarSize / 2;

    nodeG.append('circle')
      .attr('cx', avatarX + avatarSize / 2)
      .attr('cy', avatarY + avatarSize / 2)
      .attr('r', avatarSize / 2)
      .style('fill', (d) => getAvatarColor(d.data.name).bg)
      .style('opacity', (d) => {
        if (!q) return 1;
        return d.data.name.toLowerCase().includes(q.toLowerCase()) ? 1 : 0.3;
      });

    nodeG.append('text')
      .attr('x', avatarX + avatarSize / 2)
      .attr('y', avatarY + avatarSize / 2 + 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .style('font-family', 'Inter, sans-serif')
      .style('fill', (d) => getAvatarColor(d.data.name).color)
      .style('opacity', (d) => {
        if (!q) return 1;
        return d.data.name.toLowerCase().includes(q.toLowerCase()) ? 1 : 0.3;
      })
      .text((d) => getInitials(d.data.name));

    nodeG.filter((d) => Boolean(d.data.avatarUrl))
      .append('image')
      .attr('href', (d) => d.data.avatarUrl)
      .attr('x', avatarX)
      .attr('y', avatarY)
      .attr('width', avatarSize)
      .attr('height', avatarSize)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('crossorigin', 'anonymous')
      .style('clip-path', 'circle(50%)')
      .style('opacity', (d) => {
        if (!q) return 1;
        return d.data.name.toLowerCase().includes(q.toLowerCase()) ? 1 : 0.3;
      })
      .on('error', function () {
        d3.select(this).remove();
      });

    const textX = avatarX + avatarSize + 8;

    // Name
    nodeG.append('text')
      .attr('x', textX)
      .attr('y', NODE_HEIGHT / 2 - 10)
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('font-family', 'Inter, sans-serif')
      .style('fill', 'var(--foreground)')
      .style('opacity', (d) => {
        if (!q) return 1;
        return d.data.name.toLowerCase().includes(q.toLowerCase()) ? 1 : 0.3;
      })
      .each(function (d) {
        const text = d3.select(this);
        const words = d.data.name.split(' ');
        if (words.length > 1) {
          text.append('tspan').attr('x', textX).attr('dy', 0).text(words[0]);
          text.append('tspan').attr('x', textX).attr('dy', 14).text(words.slice(1).join(' '));
        } else {
          text.text(d.data.name);
        }
      });

    // Title
    nodeG.append('text')
      .attr('x', textX)
      .attr('y', NODE_HEIGHT / 2 + 14)
      .style('font-size', '10px')
      .style('font-family', 'Inter, sans-serif')
      .style('fill', 'var(--muted-foreground)')
      .style('opacity', (d) => {
        if (!q) return 1;
        return d.data.name.toLowerCase().includes(q.toLowerCase()) ? 1 : 0.3;
      })
      .text((d) => {
        const t = d.data.title;
        return t.length > 22 ? t.slice(0, 22) + '...' : t;
      });

    // Expand/collapse indicator (bottom circle) for nodes with children
    nodeG.filter((d) => d.data.childCount > 0)
      .append('circle')
      .attr('cx', NODE_WIDTH / 2)
      .attr('cy', NODE_HEIGHT)
      .attr('r', 8)
      .style('fill', 'var(--primary)')
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0 1px 2px rgba(16,32,26,0.18))');

    nodeG.filter((d) => d.data.childCount > 0)
      .append('text')
      .attr('x', NODE_WIDTH / 2)
      .attr('y', NODE_HEIGHT + 5)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--primary-foreground)')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text((d) => (collapsed.has(d.data.id) && !q ? '+' : '-'));
  }

  useEffect(() => {
    if (!treeData || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g');
    gRef.current = g;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    zoomRef.current = zoom;
    svg.call(zoom);

    const visibleTree = filterCollapsedTree(treeData, collapsed, Boolean(search.trim()));
    const hierarchyRoot = d3.hierarchy<OrgNode>(visibleTree);
    const tree = d3.tree<OrgNode>().nodeSize([NODE_WIDTH + H_GAP, NODE_HEIGHT + V_GAP]);
    const layout = tree(hierarchyRoot);
    rootRef.current = layout;

    // Center on root
    const nodes = layout.descendants();
    const minX = Math.min(...nodes.map((n) => n.x));
    const maxX = Math.max(...nodes.map((n) => n.x));
    const cx = (width - (maxX + minX)) / 2;
    const cy = 80;
    svg.call(zoom.transform, d3.zoomIdentity.translate(cx, cy));

    renderChart(g, layout, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData, collapsed, search]);

  const handleSearch = (q: string) => {
    setSearch(q);
  };

  const zoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).call(zoomRef.current.scaleBy, 1.3);
    }
  };

  const zoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).call(zoomRef.current.scaleBy, 0.7);
    }
  };

  const resetZoom = () => {
    if (svgRef.current && zoomRef.current && containerRef.current) {
      const width = containerRef.current.clientWidth || 800;
      const layout = rootRef.current;
      if (layout) {
        const nodes = layout.descendants();
        const minX = Math.min(...nodes.map((n) => n.x));
        const maxX = Math.max(...nodes.map((n) => n.x));
        const cx = (width - (maxX + minX)) / 2;
        d3.select(svgRef.current).call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(cx, 80)
        );
      } else {
        d3.select(svgRef.current).call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(400, 80)
        );
      }
    }
  };

  const exportPng = () => {
    if (!svgRef.current) return;
    const svgEl = svgRef.current;
    const exportSvg = svgEl.cloneNode(true) as SVGSVGElement;
    exportSvg.querySelectorAll('image').forEach((image) => image.remove());
    const serializer = new XMLSerializer();
    let svgStr = serializer.serializeToString(exportSvg);
    svgStr = '<?xml version="1.0" encoding="UTF-8"?>' + svgStr;
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svgEl.clientWidth * 2;
      canvas.height = svgEl.clientHeight * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#f7faf8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = 'org-chart.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const collapseAll = () => setCollapsed(new Set(managerIds));
  const expandAll = () => setCollapsed(new Set());

  return (
    <div className="flex flex-col h-full" style={{ minHeight: '500px' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 border-b border-[color:var(--border)] bg-[color:var(--card)] flex-wrap">
        <div className="pc-search-field flex-1 min-w-[200px]">
          <Search
            className="pc-search-icon"
            size={14}
          />
          <input
            type="search"
            placeholder="Search employees..."
            className="pc-input pc-search-input h-9 text-sm"
            id="org-chart-search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {!isMobile && (
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="pc-btn pc-btn-ghost pc-btn-sm flex items-center gap-1.5"
              aria-label="Expand all organization branches"
              title="Expand all organization branches"
            >
              <Plus size={14} /> Expand all
            </button>
            <button
              onClick={collapseAll}
              className="pc-btn pc-btn-ghost pc-btn-sm flex items-center gap-1.5"
              aria-label="Collapse all organization branches"
              title="Collapse all organization branches"
            >
              <Minus size={14} /> Collapse all
            </button>
            <button
              onClick={zoomIn}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
              aria-label="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={zoomOut}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
              aria-label="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={resetZoom}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
              aria-label="Reset zoom"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={exportPng}
              className="pc-btn pc-btn-ghost pc-btn-sm flex items-center gap-1.5"
              id="export-org-chart"
            >
              <Download size={14} /> Export PNG
            </button>
          </div>
        )}
      </div>

      {/* Chart or mobile list */}
      {isMobile ? (
        <MobileOrgTree
          employees={employees}
          search={search}
          collapsed={collapsed}
          onToggle={toggleNode}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
        />
      ) : (
        <div className="flex-1 overflow-hidden" ref={containerRef}>
          <svg
            ref={svgRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              minHeight: 500,
            }}
          />
        </div>
      )}
    </div>
  );
}

interface MobileOrgTreeProps {
  employees: Employee[];
  search: string;
  collapsed: Set<string>;
  onToggle: (id: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

function MobileOrgTree({
  employees,
  search,
  collapsed,
  onToggle,
  onExpandAll,
  onCollapseAll,
}: MobileOrgTreeProps) {
  const query = search.trim().toLowerCase();
  const byManager = useMemo(() => {
    const groups = new Map<string | null, Employee[]>();
    employees.forEach((employee) => {
      const group = groups.get(employee.managerId) ?? [];
      group.push(employee);
      groups.set(employee.managerId, group);
    });
    return groups;
  }, [employees]);

  const renderLevel = (managerId: string | null, depth: number): React.ReactNode =>
    (byManager.get(managerId) ?? []).map((employee) => {
      const children = byManager.get(employee.id) ?? [];
      const isCollapsed = collapsed.has(employee.id) && !query;
      const matches = !query || employee.fullName.toLowerCase().includes(query);

      return (
        <div key={employee.id}>
          <div
            className="flex items-center gap-3 border-b border-[color:var(--border)] px-4 py-3"
            style={{ paddingLeft: 16 + depth * 18, opacity: matches ? 1 : 0.3 }}
          >
            <Avatar name={employee.fullName} avatarUrl={employee.avatarUrl} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">
                {employee.fullName}
              </p>
              <p className="truncate text-xs text-[color:var(--muted-foreground)]">
                {employee.jobTitle}
              </p>
              <p className="truncate text-xs text-[color:var(--muted-foreground)]">
                {employee.department}
              </p>
            </div>
            {children.length > 0 && (
              <button
                type="button"
                onClick={() => onToggle(employee.id)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--primary-soft)] text-[color:var(--primary)]"
                aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${employee.fullName}'s reports`}
                title={`${isCollapsed ? 'Expand' : 'Collapse'} ${employee.fullName}'s reports`}
              >
                {isCollapsed ? <Plus size={16} /> : <Minus size={16} />}
              </button>
            )}
          </div>
          {!isCollapsed && renderLevel(employee.id, depth + 1)}
        </div>
      );
    });

  return (
    <div className="overflow-y-auto">
      <div className="flex gap-2 border-b border-[color:var(--border)] p-3">
        <button
          type="button"
          onClick={onExpandAll}
          className="pc-btn pc-btn-ghost pc-btn-sm flex flex-1 items-center justify-center gap-1.5"
        >
          <Plus size={14} /> Expand all
        </button>
        <button
          type="button"
          onClick={onCollapseAll}
          className="pc-btn pc-btn-ghost pc-btn-sm flex flex-1 items-center justify-center gap-1.5"
        >
          <Minus size={14} /> Collapse all
        </button>
      </div>
      {renderLevel(null, 0)}
    </div>
  );
}
