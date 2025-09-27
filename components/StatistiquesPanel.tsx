'use client';

import React from 'react';
import { BarChart3, TrendingUp, Award, Target, BookOpen, Calendar } from 'lucide-react';
import { StatistiquesResultat, SemestreTableData } from '@/types/resultat';

interface StatistiquesPanelProps {
  statistiquesGlobales: StatistiquesResultat;
  semestresData: SemestreTableData[];
}

const StatistiquesPanel: React.FC<StatistiquesPanelProps> = ({
  statistiquesGlobales,
  semestresData
}) => {
  // Calcul des statistiques avancées
  const getMeilleurePerformance = () => {
    if (!semestresData || semestresData.length === 0) return null;
    return semestresData.reduce((best, current) => 
      current.statistiques.moyenneGenerale > best.statistiques.moyenneGenerale ? current : best
    );
  };

  const getPlusBassePerformance = () => {
    if (!semestresData || semestresData.length === 0) return null;
    return semestresData.reduce((worst, current) => 
      current.statistiques.moyenneGenerale < worst.statistiques.moyenneGenerale ? current : worst
    );
  };

  const getEvolutionMoyennes = () => {
    if (!semestresData || semestresData.length === 0) return [];
    return semestresData.map(data => ({
      semestre: data.semestre.designation,
      moyenne: data.statistiques.moyenneGenerale,
      creditsValides: data.statistiques.creditsValides,
      totalCredits: data.statistiques.totalCredits
    }));
  };

  const getNiveauPerformance = (moyenne: number) => {
    if (moyenne >= 16) return { label: 'Excellent', color: 'text-green-600 bg-green-100', icon: '🏆' };
    if (moyenne >= 14) return { label: 'Très Bien', color: 'text-blue-600 bg-blue-100', icon: '🥇' };
    if (moyenne >= 12) return { label: 'Bien', color: 'text-yellow-600 bg-yellow-100', icon: '🥈' };
    if (moyenne >= 10) return { label: 'Passable', color: 'text-orange-600 bg-orange-100', icon: '🥉' };
    return { label: 'Insuffisant', color: 'text-red-600 bg-red-100', icon: '❌' };
  };

  const meilleurePerf = getMeilleurePerformance();
  const plusBassePerf = getPlusBassePerformance();
  const evolution = getEvolutionMoyennes();
  const niveauGlobal = getNiveauPerformance(statistiquesGlobales.moyenneGenerale);

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Statistiques Globales</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {(statistiquesGlobales.moyenneGenerale || 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Moyenne Générale</div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${niveauGlobal.color}`}>
              <span className="mr-1">{niveauGlobal.icon}</span>
              {niveauGlobal.label}
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {(statistiquesGlobales.pourcentageReussite || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Taux de Réussite</div>
            <div className="text-xs text-gray-500 mt-2">
              {statistiquesGlobales.creditsValides || 0}/{statistiquesGlobales.totalCredits || 0} crédits
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {statistiquesGlobales.nombreCoursValides || 0}
            </div>
            <div className="text-sm text-gray-600">Cours Validés</div>
            <div className="text-xs text-gray-500 mt-2">
              sur {statistiquesGlobales.nombreCours || 0} cours
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {semestresData.length}
            </div>
            <div className="text-sm text-gray-600">Semestres</div>
            <div className="text-xs text-gray-500 mt-2">
              Évalués
            </div>
          </div>
        </div>
      </div>

      {/* Performance par semestre */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Meilleure performance */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Meilleure Performance</h4>
          </div>
          {meilleurePerf ? (
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-800">{meilleurePerf.semestre.designation}</div>
                <div className="text-sm text-gray-600">{meilleurePerf.semestre.description}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Moyenne:</span>
                <span className="text-lg font-bold text-green-600">
                  {(meilleurePerf.statistiques.moyenneGenerale || 0).toFixed(2)}/20
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Crédits validés:</span>
                <span className="font-medium text-gray-800">
                  {meilleurePerf.statistiques.creditsValides || 0}/{meilleurePerf.statistiques.totalCredits || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux de réussite:</span>
                <span className="font-medium text-green-600">
                  {(meilleurePerf.statistiques.pourcentageReussite || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Aucune donnée disponible</p>
            </div>
          )}
        </div>

        {/* Plus basse performance */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-orange-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800">À Améliorer</h4>
          </div>
          {plusBassePerf ? (
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-800">{plusBassePerf.semestre.designation}</div>
                <div className="text-sm text-gray-600">{plusBassePerf.semestre.description}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Moyenne:</span>
                <span className="text-lg font-bold text-orange-600">
                  {(plusBassePerf.statistiques.moyenneGenerale || 0).toFixed(2)}/20
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Crédits validés:</span>
                <span className="font-medium text-gray-800">
                  {plusBassePerf.statistiques.creditsValides || 0}/{plusBassePerf.statistiques.totalCredits || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux de réussite:</span>
                <span className="font-medium text-orange-600">
                  {(plusBassePerf.statistiques.pourcentageReussite || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* Évolution des performances */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-800">Évolution par Semestre</h4>
        </div>

        <div className="space-y-4">
          {evolution.map((item, index) => {
            const pourcentage = (item.creditsValides / item.totalCredits) * 100;
            const niveau = getNiveauPerformance(item.moyenne);
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="font-medium text-gray-800">{item.semestre}</div>
                    <div className="text-sm text-gray-600">
                      {item.creditsValides}/{item.totalCredits} crédits validés
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {(item.moyenne || 0).toFixed(2)}/20
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${niveau.color}`}>
                      <span className="mr-1">{niveau.icon}</span>
                      {niveau.label}
                    </div>
                  </div>
                </div>
                
                {/* Barre de progression */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${pourcentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {(pourcentage || 0).toFixed(1)}% de réussite
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <Award className="w-4 h-4 text-yellow-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-800">Recommandations</h4>
        </div>

        <div className="space-y-3 text-sm">
          {statistiquesGlobales.moyenneGenerale >= 14 && (
            <div className="flex items-start space-x-2">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">
                Excellentes performances ! Continuez sur cette lancée pour maintenir votre niveau.
              </span>
            </div>
          )}
          
          {statistiquesGlobales.moyenneGenerale >= 10 && statistiquesGlobales.moyenneGenerale < 14 && (
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">→</span>
              <span className="text-gray-700">
                Bonnes performances. Concentrez-vous sur les matières où vous avez le plus de difficultés.
              </span>
            </div>
          )}
          
          {statistiquesGlobales.moyenneGenerale < 10 && (
            <div className="flex items-start space-x-2">
              <span className="text-orange-600">!</span>
              <span className="text-gray-700">
                Il est important de revoir vos méthodes de travail et de demander de l'aide si nécessaire.
              </span>
            </div>
          )}

          {statistiquesGlobales.pourcentageReussite < 70 && (
            <div className="flex items-start space-x-2">
              <span className="text-orange-600">!</span>
              <span className="text-gray-700">
                Votre taux de validation des crédits pourrait être amélioré. Focalisez-vous sur les cours à rattraper.
              </span>
            </div>
          )}

          <div className="flex items-start space-x-2">
            <span className="text-blue-600">💡</span>
            <span className="text-gray-700">
              Consultez régulièrement vos résultats pour suivre votre progression et identifier les axes d'amélioration.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesPanel;
