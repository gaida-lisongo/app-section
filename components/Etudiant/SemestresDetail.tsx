"use client";

import React, { useState, useMemo } from 'react';
import { Semestre, Cours, FicheCotation } from '@/types/etudiant';
import { 
  BookOpen, 
  FileText,
  CheckCircle, 
  AlertCircle,
  XCircle,
  Eye,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Badge,
} from '@/components/ui/badge';
import TravailSubscriptionModal from './TravailSubscriptionModal';
import SeanceSubscriptionModal from './SeanceSubscriptionModal';
import CoursDetailModal from '../Enseignement/CoursDetailModal';

interface CoursInscrit {
  cours: Cours;
  semestre: string;
  unite: string;
  ficheCotation: FicheCotation;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const SemestresDetail = ({
  semestres
}: {
  semestres: Semestre[]
}) => {
  const [selectedCours, setSelectedCours] = useState<CoursInscrit | null>(null);
  const [showCoursDetail, setShowCoursDetail] = useState(false);
  const [showTravailModal, setShowTravailModal] = useState(false);
  const [showSeanceModal, setShowSeanceModal] = useState(false);

  // Extraire tous les cours auxquels l'étudiant est inscrit (avec fiche de cotation)
  const coursInscrits = useMemo(() => {
    const cours: CoursInscrit[] = [];
    
    semestres.forEach(semestre => {
      semestre.unites.forEach(unite => {
        unite.cours.forEach(coursItem => {
          if (coursItem.fiche_cotation) {
            cours.push({
              cours: coursItem,
              semestre: semestre.designation,
              unite: unite.descripteur.designation,
              ficheCotation: coursItem.fiche_cotation,
              status: coursItem.fiche_cotation.status
            });
          }
        });
      });
    });
    
    return cours;
  }, [semestres]);

  const getStatusBadge = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const handleViewCours = (coursInscrit: CoursInscrit) => {
    setSelectedCours(coursInscrit);
    setShowCoursDetail(true);
  };

  const handleSouscrireTravail = (coursInscrit: CoursInscrit) => {
    setSelectedCours(coursInscrit);
    setShowTravailModal(true);
  };

  const handleSouscrireSeance = (coursInscrit: CoursInscrit) => {
    setSelectedCours(coursInscrit);
    setShowSeanceModal(true);
  };

  console.log("Data semestres student :", semestres);
  console.log("Cours inscrits :", coursInscrits);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Mes Cours Inscrits
          </CardTitle>
          <CardDescription>
            Liste de tous les cours auxquels vous êtes inscrit avec possibilité de souscrire aux travaux et séances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {coursInscrits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun cours inscrit trouvé</p>
              <p className="text-sm">Les cours apparaîtront ici une fois que vous aurez des fiches de cotation</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cours</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead>Crédits</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Travaux</TableHead>
                    <TableHead>Séances</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coursInscrits.map((coursInscrit, index) => (
                    <TableRow key={`${coursInscrit.cours._id}-${index}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{coursInscrit.cours.titre}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {coursInscrit.cours.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{coursInscrit.semestre}</TableCell>
                      <TableCell>{coursInscrit.unite}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{coursInscrit.cours.credit} crédits</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(coursInscrit.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {coursInscrit.cours.travaux?.length || 0} disponible(s)
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSouscrireTravail(coursInscrit)}
                            disabled={!coursInscrit.cours.travaux?.length}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Souscrire
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {coursInscrit.cours.seances?.length || 0} disponible(s)
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSouscrireSeance(coursInscrit)}
                            disabled={!coursInscrit.cours.seances?.length}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Souscrire
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewCours(coursInscrit)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{coursInscrits.length}</div>
                <div className="text-sm text-gray-500">Cours inscrits</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {coursInscrits.filter(c => c.status === 'APPROVED').length}
                </div>
                <div className="text-sm text-gray-500">Approuvés</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">
                  {coursInscrits.filter(c => c.status === 'PENDING').length}
                </div>
                <div className="text-sm text-gray-500">En attente</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {coursInscrits.reduce((total, c) => total + c.cours.credit, 0)}
                </div>
                <div className="text-sm text-gray-500">Crédits totaux</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {selectedCours && (
        <>
          <CoursDetailModal
            isOpen={showCoursDetail}
            onClose={() => setShowCoursDetail(false)}
            cours={selectedCours.cours}
          />
          
          <TravailSubscriptionModal
            isOpen={showTravailModal}
            onClose={() => setShowTravailModal(false)}
            cours={selectedCours.cours}
            travaux={selectedCours.cours.travaux || []}
          />
          
          <SeanceSubscriptionModal
            isOpen={showSeanceModal}
            onClose={() => setShowSeanceModal(false)}
            cours={selectedCours.cours}
            seances={selectedCours.cours.seances || []}
          />
        </>
      )}
    </div>
  );
};

export default SemestresDetail;
