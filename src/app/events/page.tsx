import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react"

// Mock data for events
const UPCOMING_EVENTS = [
  {
    id: "1",
    title: "Tarifa Kite Championship",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    location: "Tarifa Beach, Spain",
    type: "Competition",
    description:
      "Join us for the annual Tarifa Kite Championship, featuring top riders from around the world competing for the title.",
    attendees: 120,
    image: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "2",
    title: "Beginner Kite Workshop",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    location: "Los Lances, Spain",
    type: "Workshop",
    description: "Learn the basics of kitesurfing in this beginner-friendly workshop led by professional instructors.",
    attendees: 15,
    image: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "3",
    title: "Sunset Kite Session",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    location: "Valdevaqueros, Spain",
    type: "Social",
    description: "Join fellow kitesurfers for a relaxed evening session followed by beachside drinks and networking.",
    attendees: 35,
    image: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "4",
    title: "Advanced Tricks Masterclass",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    location: "Punta Paloma, Spain",
    type: "Workshop",
    description:
      "Take your kitesurfing to the next level with this advanced tricks masterclass taught by pro rider Carlos Martinez.",
    attendees: 10,
    image: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "5",
    title: "Kite Equipment Demo Day",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    location: "Tarifa Beach, Spain",
    type: "Demo",
    description: "Try out the latest kitesurfing gear from top brands and get expert advice on equipment selection.",
    attendees: 75,
    image: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "6",
    title: "Beach Cleanup Initiative",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    location: "Los Lances, Spain",
    type: "Community",
    description:
      "Help keep our beaches clean! Join the kitesurfing community for a morning of beach cleanup followed by a group session.",
    attendees: 45,
    image: "/placeholder.svg?height=300&width=600",
  },
]

export default function EventsPage() {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  // Group events by month
  const eventsByMonth: Record<string, typeof UPCOMING_EVENTS> = {}

  UPCOMING_EVENTS.forEach((event) => {
    const date = new Date(event.date)
    const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    if (!eventsByMonth[monthYear]) {
      eventsByMonth[monthYear] = []
    }

    eventsByMonth[monthYear].push(event)
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Kitesurfing Events</h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
            Discover upcoming kitesurfing competitions, workshops, and community gatherings around the world.
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UPCOMING_EVENTS.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-blue-600 hover:bg-blue-700">{event.type}</Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>{formatTime(event.date)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>{event.attendees} attendees</span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{event.description}</p>

                      <Button variant="outline" className="w-full mt-2">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
                <CardDescription>Browse events by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {Object.entries(eventsByMonth).map(([monthYear, events]) => (
                    <div key={monthYear}>
                      <h3 className="text-xl font-semibold mb-4 border-b pb-2">{monthYear}</h3>
                      <div className="space-y-4">
                        {events.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-md flex flex-col items-center min-w-[60px]">
                              <span className="text-xs font-medium">
                                {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                              </span>
                              <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{event.title}</h4>
                                  <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                                <Badge>{event.type}</Badge>
                              </div>

                              <div className="mt-2 flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTime(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{event.attendees} attendees</span>
                                </div>
                              </div>
                            </div>

                            <Button variant="ghost" size="icon">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Past Events</CardTitle>
                <CardDescription>Browse previous kitesurfing events and competitions</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-medium mb-2">No past events to display</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  We're still building our event history. Check back soon to see past events and highlights.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Organize Your Own Event</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
            Are you planning a kitesurfing competition, workshop, or community gathering? List it on Kiteaways to reach
            thousands of kitesurfers.
          </p>
          <Button size="lg" className="gap-2">
            Submit an Event
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

