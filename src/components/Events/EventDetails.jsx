import { Link, Outlet, useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchEvent, deleteEvent, queryClient } from '../utils/http.jsx'
import { useState } from 'react'

import Header from '../Header.jsx'
import ErrorBlock from '../UI/ErrorBlock'
import Modal from '../UI/Modal'
export default function EventDetails() {
  const [isDeleteing, setIsDeleting] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['event', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  })

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none',
      })
      console.log('saif')
      navigate('/events')
    },
  })
  const baseURL = 'https://event-creater-app.onrender.com'
  function HandleStartDelete() {
    setIsDeleting(true)
  }
  function HandleStopDelete() {
    setIsDeleting(false)
  }
  function HandleDelete() {
    mutate({ id })
  }
  let content

  if (isPending) {
    content = (
      <div id="event-details-content" className="centre">
        <p>Fetching event data...</p>
      </div>
    )
  }
  if (isError) {
    content = (
      <div id="event-details-content" className="centre">
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            'Failed to fetch event data please try again later'
          }
        />
      </div>
    )
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={HandleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`${baseURL}/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formattedDate} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      {isDeleteing && (
        <Modal onClose={HandleStopDelete}>
          <h2>Are you Sure?</h2>
          <p>Do you really want to delete this event? This cannot be undone</p>
          <div className="form-actions">
            {isPendingDeletion && <p>Deleting, please wait ...</p>}
            {!isPendingDeletion && (
              <>
                <button onClick={HandleStopDelete} className="button-text">
                  Cancel
                </button>
                <button onClick={HandleDelete} className="button">
                  Delete
                </button>
              </>
            )}
          </div>
          {isErrorDeleting && (
            <ErrorBlock
              title="Falied to delete event"
              message={
                deleteError.info?.message ||
                'Failed to delete event, Please try again later.'
              }
            ></ErrorBlock>
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  )
}
