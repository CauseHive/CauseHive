import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import { cn } from '../../utils/cn';

/**
 * Virtualized Table Component
 * Enterprise-grade performance for large datasets
 */
const VirtualizedTable = ({
  data = [],
  columns = [],
  height = 400,
  rowHeight = 60,
  className,
  title,
  loading = false,
  onRowClick,
}) => {
  const parentRef = React.useRef();

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key] || '-';
  };

  return (
    <Card className={cn("w-full", className)}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="grid border-b border-border bg-muted/50" 
             style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}>
          {columns.map((column) => (
            <div
              key={column.key}
              className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
            >
              {column.title}
            </div>
          ))}
        </div>

        {/* Virtualized Table Body */}
        <div
          ref={parentRef}
          className="overflow-auto"
          style={{ height: `${height}px` }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const item = data[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  className={cn(
                    "grid border-b border-border hover:bg-muted/50 transition-colors absolute",
                    onRowClick && "cursor-pointer"
                  )}
                  style={{ 
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                    gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ')
                  }}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className="px-4 py-3 text-sm text-foreground flex items-center"
                    >
                      {renderCell(item, column)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No data available
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground">
            Loading...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualizedTable;