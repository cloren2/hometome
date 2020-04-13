<?php

namespace App\Controller;

use App\Entity\Preferencias;
use App\Form\PreferenciasType;
use App\Repository\PreferenciasRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/preferencias")
 */
class PreferenciasController extends AbstractController
{
    /**
     * @Route("/", name="preferencias_index", methods={"GET"})
     */
    public function index(PreferenciasRepository $preferenciasRepository): Response
    {
        return $this->render('preferencias/index.html.twig', [
            'preferencias' => $preferenciasRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="preferencias_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $preferencia = new Preferencias();
        $form = $this->createForm(PreferenciasType::class, $preferencia);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $name =  $form->get('nombre')->getData();
            $nombre = ucfirst(strtolower($name));
            $preferencia->setNombre($nombre);
            try {
                $entityManager->persist($preferencia);
                $entityManager->flush();
            } catch (\Doctrine\DBAL\DBALException $e) {
                $errorMessage = "Preferencia duplicada";
                return $this->render('ciudad/new.html.twig', [
                    'error' => $errorMessage,
                    'form' => $form->createView()
                ]);
            }
            return $this->redirectToRoute('preferencias_index');
        }

        return $this->render('preferencias/new.html.twig', [
            'preferencia' => $preferencia,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="preferencias_show", methods={"GET"})
     */
    public function show(Preferencias $preferencia): Response
    {
        return $this->render('preferencias/show.html.twig', [
            'preferencia' => $preferencia,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="preferencias_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Preferencias $preferencia): Response
    {
        $form = $this->createForm(PreferenciasType::class, $preferencia);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
          
            try {
                $this->getDoctrine()->getManager()->flush();
            } catch (\Doctrine\DBAL\DBALException $e) {
                $errorMessage = "Preferencia duplicada";
                return $this->render('preferencias/edit.html.twig', [
                    'error' => $errorMessage,
                    'preferencia' => $preferencia,
                    'form' => $form->createView()
                ]);
            }
            return $this->redirectToRoute('preferencias_index');
        }

        return $this->render('preferencias/edit.html.twig', [
            'preferencia' => $preferencia,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="preferencias_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Preferencias $preferencia): Response
    {
        if ($this->isCsrfTokenValid('delete'.$preferencia->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($preferencia);
            $entityManager->flush();
        }

        return $this->redirectToRoute('preferencias_index');
    }
}
