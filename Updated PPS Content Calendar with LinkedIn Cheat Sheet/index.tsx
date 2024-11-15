'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Clock, ThumbsUp, Link, BarChart2, Hash, UserPlus, Lightbulb } from 'lucide-react'

// ... (keep the existing calendarData and categoryColors)

const brandColors = {
  primary: '#009BA2',
  secondary: '#3E3C3B',
}

const iconAnimationProps = {
  whileHover: { scale: 1.2, rotate: 5 },
  whileTap: { scale: 0.9 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
}

const GlassmorphicCard = ({ children, className = "" }) => (
  <Card className={`overflow-hidden backdrop-blur-lg bg-white/90 border border-white/20 ${className}`}>
    {children}
  </Card>
)

const SectionWrapper = ({ children, icon, title }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <GlassmorphicCard className="mb-8 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[#009BA2]/50 to-[#3E3C3B]/50 p-6">
          <CardTitle className="text-2xl font-bold flex items-center text-white">
            <motion.span {...iconAnimationProps} className="mr-2 text-white">
              {icon}
            </motion.span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </GlassmorphicCard>
    </motion.div>
  )
}

const AnimatedListItem = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-2"
    >
      {children}
    </motion.li>
  )
}

const InteractiveTable = ({ data, tooltips }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Object.keys(data[0]).map((header, index) => (
            <TableHead key={index} className="font-bold text-[#009BA2]">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <motion.tr
            key={rowIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            className="transition-all duration-200"
          >
            {Object.entries(row).map(([key, cell], cellIndex) => (
              <TableCell key={cellIndex}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">{cell}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tooltips[rowIndex][key]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            ))}
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  )
}

const ExpandableCard = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <GlassmorphicCard className="mb-4 overflow-hidden">
      <motion.div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassmorphicCard>
  )
}

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009BA2] to-[#3E3C3B] z-50"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

export default function Component() {
  const [currentPage, setCurrentPage] = useState(0)
  const postsPerPage = 5
  const totalPages = Math.ceil(calendarData.length / postsPerPage)

  const paginatedPosts = calendarData.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  )

  const [isSticky, setIsSticky] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        setIsSticky(window.scrollY > headerRef.current.offsetHeight)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#009BA2]/10 to-[#3E3C3B]/10 p-4 md:p-8 font-sans">
      <ScrollProgressBar />
      <div className="max-w-7xl mx-auto">
        {/* Updated Corporate Banner */}
        <div className="w-full mb-8">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PPS_Final_LIBannerpersonal_2178x545-03-dMKvHhMb1Nv8rYhcWfJYnJhahNuc8G.png"
            alt="PPS Corporate Banner"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Glassmorphic Navigation Bar */}
        <div className={`sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm rounded-lg mb-8 transition-all duration-300 ${
          isSticky ? "shadow-md" : ""
        }`}>
          <div className="container mx-auto p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#009BA2] to-[#3E3C3B] bg-clip-text text-transparent">
              Redaktionsplanung PPS Linkedin 24/25
            </h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="hover:bg-[#009BA2]/10"
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">Seite {currentPage + 1} von {totalPages}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="hover:bg-[#009BA2]/10"
                aria-label="Next page"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <GlassmorphicCard className="mb-8">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100/50">
                    <TableHead className="font-bold">Datum</TableHead>
                    <TableHead className="font-bold">Thema</TableHead>
                    <TableHead className="font-bold">Cluster</TableHead>
                    <TableHead className="font-bold">Hook Varianten</TableHead>
                    <TableHead className="font-bold">Tonalität</TableHead>
                    <TableHead className="font-bold">Stil</TableHead>
                    <TableHead className="font-bold">Motivvorschlag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {paginatedPosts.map((post, index) => (
                      <motion.tr
                        key={post.Datum}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`group transition-colors ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white/50'} hover:bg-[#009BA2]/5`}
                      >
                        <TableCell className="font-medium border-b border-gray-200">{post.Datum}</TableCell>
                        <TableCell className="font-semibold text-lg border-b border-gray-200">{post.Thema}</TableCell>
                        <TableCell className="border-b border-gray-200">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.Cluster)}`}>
                            {post.Cluster}
                          </span>
                        </TableCell>
                        <TableCell className="border-b border-gray-200">
                          <ul className="space-y-2">
                            {post["Hook Varianten"].map((hook, i) => (
                              <motion.li
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                className={`text-sm p-2 rounded-lg backdrop-blur-sm ${
                                  i === 0
                                    ? 'bg-[#009BA2]/10 text-[#009BA2]'
                                    : i === 1
                                    ? 'bg-[#3E3C3B]/10 text-[#3E3C3B]'
                                    : 'bg-gray-100/50 text-gray-700'
                                }`}
                              >
                                {hook}
                              </motion.li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell className="border-b border-gray-200">
                          <ul className="space-y-2">
                            {post.Tonalität.map((tone, i) => (
                              <motion.li
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                className={`text-sm p-2 rounded-lg backdrop-blur-sm ${
                                  i === 0
                                    ? 'bg-[#009BA2]/10 text-[#009BA2]'
                                    : i === 1
                                    ? 'bg-[#3E3C3B]/10 text-[#3E3C3B]'
                                    : 'bg-gray-100/50 text-gray-700'
                                }`}
                              >
                                {tone}
                              </motion.li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell className="italic border-b border-gray-200">{post.Stil}</TableCell>
                        <TableCell className="border-b border-gray-200">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm">Vorschlag</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <p className="text-sm">{post.Motivvorschlag}</p>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </GlassmorphicCard>

        {/* LinkedIn Cheat Sheet */}
        <GlassmorphicCard>
          <CardHeader className="bg-gradient-to-r from-[#009BA2]/50 to-[#3E3C3B]/50 p-6">
            <CardTitle className="text-3xl font-bold text-center text-white">
              LinkedIn Cheat Sheet 2024/2025 📊
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <SectionWrapper icon={<Calendar className="w-6 h-6" />} title="Posting-Frequenz">
              <ul className="list-disc pl-6 space-y-2">
                <AnimatedListItem>
                  <strong>Empfohlen:</strong> 2 bis 5 Posts pro Woche
                </AnimatedListItem>
                <AnimatedListItem>
                  <strong>Hinweis:</strong> Nicht mehr als 1x pro Tag, aber nicht weniger als 2x pro Woche.
                </AnimatedListItem>
                <AnimatedListItem>
                  <strong className="bg-[#009BA2]/50 text-white px-2 py-1 rounded">Wichtig:</strong> Regelmäßigkeit ist entscheidend!
                </AnimatedListItem>
              </ul>
            </SectionWrapper>

            <SectionWrapper icon={<Clock className="w-6 h-6" />} title="Bester Posting-Zeitpunkt">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium mb-2 text-[#009BA2]">Nach Format:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <AnimatedListItem>
                      <strong>Text, Bild, Video:</strong> Mo-Fr, 08:00 - 10:30 Uhr
                    </AnimatedListItem>
                    <AnimatedListItem>
                      <strong>Dokument:</strong> Mo-Fr, 08:00 - 11:00 Uhr
                    </AnimatedListItem>
                    <AnimatedListItem>
                      <strong>Umfrage:</strong> Mo-Fr, 10:00 - 12:00 Uhr
                    </AnimatedListItem>
                    <AnimatedListItem>
                      <strong>Externes Video:</strong> Di-Do, 11:00 - 13:00 Uhr
                    </AnimatedListItem>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2 text-[#009BA2]">Allgemein:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <AnimatedListItem>
                      <strong>Tage:</strong> Dienstag und Donnerstag
                    </AnimatedListItem>
                    <AnimatedListItem>
                      <strong>Zeiten:</strong> 09:00 - 10:00 Uhr & 11:00 - 12:00 Uhr
                    </AnimatedListItem>
                  </ul>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[#3E3C3B]/20 border-l-4 border-[#3E3C3B] p-4 mt-4 rounded"
                  >
                    <strong>Tipp:</strong> Am Wochenende oft weniger Reichweite, aber mehr Interaktionen!
                  </motion.div>
                </div>
              </div>
            </SectionWrapper>

            <SectionWrapper icon={<ThumbsUp className="w-6 h-6" />} title="Gewichtung der Interaktionen">
              <InteractiveTable
                data={[
                  { Aktion: "Like", Punktewert: "1 Punkt" },
                  { Aktion: "Klick auf 'Mehr'", Punktewert: "4 Punkte" },
                  { Aktion: "Teilen mit Kommentar", Punktewert: "5 Punkte" },
                  { Aktion: "Speichern", Punktewert: "6 Punkte" },
                  { Aktion: "Direkt teilen", Punktewert: "10 Punkte" },
                  { Aktion: "Kommentar", Punktewert: "12 Punkte" },
                ]}
                tooltips={[
                  { Aktion: "Einfachste Form der Interaktion", Punktewert: "Geringster Einfluss auf die Reichweite" },
                  { Aktion: "Zeigt Interesse am vollständigen Inhalt", Punktewert: "Mittlerer Einfluss auf die Reichweite" },
                  { Aktion: "Verbreitet den Inhalt mit persönlicher Note", Punktewert: "Hoher Einfluss auf die Reichweite" },
                  { Aktion: "Nutzer möchte den Inhalt später wieder finden", Punktewert: "Sehr guter Einfluss auf die Reichweite" },
                  { Aktion: "Schnelle Verbreitung des Inhalts", Punktewert: "Sehr hoher Einfluss auf die Reichweite" },
                  { Aktion: "Höchste Form der Interaktion", Punktewert: "Stärkster Einfluss auf die Reichweite" },
                ]}
              />
            </SectionWrapper>

            <SectionWrapper icon={<Link className="w-6 h-6" />} title="Umgang mit Links">
              <p className="font-semibold text-[#3E3C3B] mb-2">Externe Links reduzieren die Reichweite um 40%!</p>
              <p>Nur zwingend nötige Links einbauen.</p>
              <h4 className="text-lg font-medium mt-4 mb-2 text-[#009BA2]">Link-Platzierung & Einfluss:</h4>
              <ul className="list-none pl-0 space-y-2">
                <AnimatedListItem>
                  ❌ Link-Post mit Vorschau: (Reichweite), ❌ (Conversion)
                </AnimatedListItem>
                <AnimatedListItem>
                  ⚠️ Link nachträglich einfügen: (Reichweite), ✅ (Conversion)
                </AnimatedListItem>
                <AnimatedListItem>
                  ✅ Link im Kommentar: (Reichweite), ⚠️ (Conversion)
                </AnimatedListItem>
                <AnimatedListItem>
                  ✅ „Link kommt per DM": (Reichweite), ❌ (Conversion)
                </AnimatedListItem>
                <AnimatedListItem>
                  ✅ „Zur Website"-Button: (Reichweite), ✅ (Conversion)
                </AnimatedListItem>
              </ul>
            </SectionWrapper>

            <SectionWrapper icon={<BarChart2 className="w-6 h-6" />} title="Reichweite pro Format">
              <InteractiveTable
                data={[
                  { Format: "Umfragen", Reichweite: "1,46x Reichweite" },
                  { Format: "Dokument-Post", Reichweite:  "1,26x Reichweite" },
                  { Format: "Text-Bild-Post", Reichweite: "1,16x Reichweite" },
                  { Format: "Natives Video", Reichweite: "1,14x Reichweite" },
                  { Format: "Nur Text", Reichweite: "0,89x Reichweite" },
                  { Format: "Externes Video", Reichweite: "0,66x Reichweite" },
                  { Format: "Andere Formate", Reichweite: "0,58x Reichweite" },
                ]}
                tooltips={[
                  { Format: "Interaktive Posts fördern Engagement", Reichweite: "Höchste Reichweite durch aktive Beteiligung" },
                  { Format: "Informative Inhalte in Dokumentenform", Reichweite: "Sehr gute Reichweite für detaillierte Informationen" },
                  { Format: "Kombination aus visuellem und textuellem Inhalt", Reichweite: "Gute Balance zwischen Aufmerksamkeit und Information" },
                  { Format: "Direkt auf LinkedIn hochgeladene Videos", Reichweite: "Bevorzugt vom LinkedIn-Algorithmus" },
                  { Format: "Reine Textbeiträge ohne Medien", Reichweite: "Mittlere Reichweite, abhängig von der Qualität des Inhalts" },
                  { Format: "Videos von externen Plattformen", Reichweite: "Geringere Reichweite, da LinkedIn interne Inhalte bevorzugt" },
                  { Format: "Sonstige Beitragsarten", Reichweite: "Niedrigste durchschnittliche Reichweite" },
                ]}
              />
            </SectionWrapper>

            <SectionWrapper icon={<Hash className="w-6 h-6" />} title="Hashtags">
              <ul className="list-disc pl-6 space-y-2">
                <AnimatedListItem>
                  <strong>Einfluss auf Reichweite:</strong> Kein Einfluss mehr
                </AnimatedListItem>
                <AnimatedListItem>
                  <strong>Empfohlene Hashtags pro Post:</strong>
                  <ul className="list-circle pl-6 space-y-1 mt-2">
                    <li>Normaler Post: 2,2 Hashtags</li>
                    <li>Top 5% Post: 0,9 Hashtags</li>
                  </ul>
                </AnimatedListItem>
              </ul>
            </SectionWrapper>

            <SectionWrapper icon={<UserPlus className="w-6 h-6" />} title="Markieren">
              <p className="mb-2">
                <strong>Auswirkung auf Reichweite abhängig von Reaktion der markierten Personen:</strong>
              </p>
              <ul className="list-none pl-0 space-y-2">
                <AnimatedListItem>
                  ❌ &lt; 33% Reaktionsrate: (negative Auswirkung)
                </AnimatedListItem>
                <AnimatedListItem>
                  ⚠️ 33-66% Reaktionsrate: (teilweise negative Auswirkung)
                </AnimatedListItem>
                <AnimatedListItem>
                  ✅ &gt; 66% Reaktionsrate: (positive Auswirkung)
                </AnimatedListItem>
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#009BA2]/20 border-l-4 border-[#009BA2] p-4 mt-4 rounded"
              >
                <strong>Tipp:</strong> Tags in Kommentaren haben <strong>keinen direkten Einfluss auf Reichweite!</strong>
              </motion.div>
            </SectionWrapper>

            <SectionWrapper icon={<Lightbulb className="w-6 h-6" />} title="11 Top-Empfehlungen">
              {[
                { title: "Frühe Interaktionen", content: "Erzeuge Interaktionen in den ersten 60-120 Minuten. Dies signalisiert dem Algorithmus, dass dein Inhalt wertvoll ist." },
                { title: "Kommentar-Diskussionen", content: "Verschachtelte Kommentare haben den größten Impact auf die Reichweite. Fördere aktiv Diskussionen in deinen Beiträgen." },
                { title: "Beitrag erneut teilen", content: "Teile deinen Beitrag nach einem Tag erneut (direkt), wenn kein neuer Post geplant ist. Dies gibt deinem Inhalt eine zweite Chance auf Sichtbarkeit." },
                { title: "Qualität der Kontakte", content: "Sei wählerisch bei Kontakten (mind. 1,5x mehr Follower als Kontakte). Qualität ist wichtiger als Quantität in deinem Netzwerk." },
                { title: "Kommentare beantworten", content: "Beantworte Kommentare unbedingt (+30% Reichweite). Dies fördert Engagement und signalisiert Aktivität." },
                { title: "Nach dem Posten interagieren", content: "Interagiere nach dem Posten mit anderen Accounts. Dies erhöht deine Sichtbarkeit und fördert Gegenseitigkeit." },
                { title: "Verweildauer", content: "Hohe Verweildauer auf Beitrag = hohe Reichweite. Erstelle Inhalte, die Nutzer zum längeren Lesen oder Ansehen animieren." },
                { title: "Erfolgreiche Formate", content: "Selfies, Infografiken & Flowcharts funktionieren top. Visuelle Inhalte sind oft besonders erfolgreich." },
                { title: "Video-Optimierung", content: "Wenn Video, dann Hochformat (9:16), max. 60 Sekunden. Kurze, vertikale Videos passen am besten zum Nutzungsverhalten auf LinkedIn." },
                { title: "Textlänge und Struktur", content: "Längere Texte performen gut, aber achte auf Lesbarkeit und Struktur (kurze Sätze, häufige Absätze, Leerzeilen). Mache lange Texte leicht konsumierbar." },
                { title: "Der Hook", content: "Der Hook ist das wichtigste Element bei Texten und Videos! Fessle deine Zielgruppe von Anfang an mit einem starken Einstieg." },
              ].map((tip, index) => (
                <ExpandableCard key={index} title={tip.title} content={tip.content} />
              ))}
            </SectionWrapper>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm text-gray-600 dark:text-gray-300 mt-8 text-center"
            >
              <strong>Quellen:</strong> 5th Algorithm Insights 2024 & Update Oktober 2024, Richard van der Blom; AuthoredUp / Ivana Todorović; eigene Erfahrungen.
            </motion.div>
          </CardContent>
        </GlassmorphicCard>

        {/* Footer Logo */}
        <div className="w-full py-8 flex justify-center">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_578-N0xWqbUMQelf6mIPRjpoh0LA05bepX.png"
            alt="PPS Logo"
            className="h-12 w-auto"
          />
        </div>
      </div>
    </div>
  )
}