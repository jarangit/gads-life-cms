import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode
}

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode
}

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode
}

export function Table({ className, children, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={clsx('w-full caption-bottom text-sm', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ className, children, ...props }: TableHeaderProps) {
  return (
    <thead className={clsx('[&_tr]:border-b', className)} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({ className, children, ...props }: TableBodyProps) {
  return (
    <tbody
      className={clsx('[&_tr:last-child]:border-0', className)}
      {...props}
    >
      {children}
    </tbody>
  )
}

export function TableRow({ className, children, ...props }: TableRowProps) {
  return (
    <tr
      className={clsx(
        'border-b border-slate-200 transition-colors hover:bg-slate-50/50',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ className, children, ...props }: TableHeadProps) {
  return (
    <th
      className={clsx(
        'h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    <td
      className={clsx(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}
