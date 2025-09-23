'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProduitRapportList from '@/components/Etudiant/ProduitRapportList';
import { ProduitWithStatus, AuthResponse } from '@/types/etudiant';
import EtudiantService from '@/app/services/EtudiantService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search, BookOpen, Briefcase, GraduationCap, FileCheck, Calendar } from 'lucide-react';
import { Loader2, AlertCircle } from 'lucide-react';

const RapportsPage = () => {
  const router = useRouter();
  const [studentData, setStudentData] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadStudentData = () => {
      try {
        // Récupérer les données depuis localStorage
        const storedData = EtudiantService.getStoredFullData();
        
        if (!storedData) {
          router.push('/auth/signin');
          return;
        }

        setStudentData(storedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Erreur lors du chargement des données étudiant');
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error || 'Impossible de charger les données'}</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  const { etudiant, myRecherches, myStages, myValidations, myReleves, mySessions } = studentData;

  // Statistiques globales
  const totalProduits = [
    ...(myRecherches || []),
    ...(myStages || []),
    ...(myValidations || []),
    ...(myReleves || []),
    ...(mySessions || [])
  ].length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Gestion des Rapports
                </h1>
                <p className="text-gray-600">
                  Soumettez vos rapports pour les différents produits académiques
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Étudiant</div>
                <div className="font-semibold text-gray-900">
                  {etudiant.nom} {etudiant.post_nom} {etudiant.prenom}
                </div>
                <div className="text-sm text-blue-600">
                  Matricule: {etudiant.matricule}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Search className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{myRecherches?.length || 0}</div>
              <div className="text-sm text-gray-500">Recherches</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{myStages?.length || 0}</div>
              <div className="text-sm text-gray-500">Stages</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <GraduationCap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{myValidations?.length || 0}</div>
              <div className="text-sm text-gray-500">Validations</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <FileCheck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{myReleves?.length || 0}</div>
              <div className="text-sm text-gray-500">Relevés</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{mySessions?.length || 0}</div>
              <div className="text-sm text-gray-500">Sessions</div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets pour les différents types de produits */}
        <Tabs defaultValue="recherches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="recherches" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Recherches
            </TabsTrigger>
            <TabsTrigger value="stages" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Stages
            </TabsTrigger>
            <TabsTrigger value="validations" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Validations
            </TabsTrigger>
            <TabsTrigger value="releves" className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Relevés
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recherches">
            <ProduitRapportList
              produits={myRecherches || []}
              etudiantId={etudiant._id}
              title="Mes Recherches - Soumission de Rapports"
              emptyMessage="Aucune recherche disponible pour la soumission de rapports."
            />
          </TabsContent>

          <TabsContent value="stages">
            <ProduitRapportList
              produits={myStages || []}
              etudiantId={etudiant._id}
              title="Mes Stages - Soumission de Rapports"
              emptyMessage="Aucun stage disponible pour la soumission de rapports."
            />
          </TabsContent>

          <TabsContent value="validations">
            <ProduitRapportList
              produits={myValidations || []}
              etudiantId={etudiant._id}
              title="Mes Validations - Soumission de Rapports"
              emptyMessage="Aucune validation disponible pour la soumission de rapports."
            />
          </TabsContent>

          <TabsContent value="releves">
            <ProduitRapportList
              produits={myReleves || []}
              etudiantId={etudiant._id}
              title="Mes Relevés - Soumission de Rapports"
              emptyMessage="Aucun relevé disponible pour la soumission de rapports."
            />
          </TabsContent>

          <TabsContent value="sessions">
            <ProduitRapportList
              produits={mySessions || []}
              etudiantId={etudiant._id}
              title="Mes Sessions - Soumission de Rapports"
              emptyMessage="Aucune session disponible pour la soumission de rapports."
            />
          </TabsContent>
        </Tabs>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Instructions pour la soumission de rapports
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Seuls les fichiers PDF sont acceptés pour les rapports
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              La taille maximale des fichiers est de 10MB
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Une fois soumis, un rapport ne peut pas être modifié
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Assurez-vous que votre rapport est complet avant la soumission
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Les rapports soumis seront évalués par l'équipe pédagogique
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RapportsPage;
