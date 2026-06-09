import { EXAMPLE_QUERIES } from '../constants/examples'

interface ExampleQueriesProps {
  onSelect: (query: string) => void
  disabled?: boolean
}

export function ExampleQueries({ onSelect, disabled }: ExampleQueriesProps) {
  return (
    <div className="example-queries">
      <h2 className="example-queries-heading">Start with a common question</h2>
      <div className="example-queries-grid">
        {EXAMPLE_QUERIES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.query)}
            className="example-query-card welcome-animate"
            style={{ animationDelay: `${180 + index * 70}ms` }}
          >
            <span className="example-query-tag">{item.tag}</span>
            <span className="example-query-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
