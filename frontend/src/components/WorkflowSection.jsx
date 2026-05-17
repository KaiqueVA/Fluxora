import { steps } from '../data/landingContent'

function WorkflowSection() {
  return (
    <section className="workflow-section" aria-label="Como funciona">
      {steps.map((step, index) => (
        <article className="step-card" key={step}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{step}</h3>
        </article>
      ))}
    </section>
  )
}

export default WorkflowSection