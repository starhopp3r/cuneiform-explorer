"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2, LineChart } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { format } from "date-fns"

interface SessionData {
  id: number
  date: string
  score: number
  total: number
  time: number
  speed: number
}

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([])

  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem('sessionMetrics') || '[]')
    setSessions(storedSessions.sort((a: SessionData, b: SessionData) => b.id - a.id))
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const clearHistory = () => {
    localStorage.removeItem('sessionMetrics')
    setSessions([])
  }

  const deleteSession = (id: number) => {
    const updatedSessions = sessions.filter(session => session.id !== id)
    localStorage.setItem('sessionMetrics', JSON.stringify(updatedSessions))
    setSessions(updatedSessions)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-background/80 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="hover:bg-destructive/90 transition-colors duration-200"
              disabled={sessions.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your session records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearHistory} className="bg-destructive hover:bg-destructive/90">
                Delete All Records
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="py-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-relaxed">
              Learning Analytics
            </h1>
          </div>
          <p className="text-muted-foreground">Track your progress and improvement over time</p>
        </div>

        {sessions.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-muted p-6 w-fit">
                <LineChart className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  No session records found
                </h3>
                <p className="text-muted-foreground text-lg">
                  Complete some practice sessions to see your progress!
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-6">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={[...sessions].reverse()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy HH:mm')}
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="speed"
                      name="Speed (signs/min)"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="score"
                      name="Score"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        {format(new Date(session.date), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        {session.score}/{session.total} ({Math.round(session.score/session.total * 100)}%)
                      </TableCell>
                      <TableCell>{formatTime(session.time)}</TableCell>
                      <TableCell>{session.speed} signs/min</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove this session record. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteSession(session.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete Record
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
      </motion.div>
    </div>
  )
} 