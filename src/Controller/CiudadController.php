<?php

namespace App\Controller;

use App\Entity\Ciudad;
use App\Form\CiudadType;
use App\Repository\CiudadRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/ciudad")
 */
class CiudadController extends AbstractController
{
    /**
     * @Route("/", name="ciudad_index", methods={"GET"})
     */
    public function index(CiudadRepository $ciudadRepository): Response
    {
        return $this->render('ciudad/index.html.twig', [
            'ciudads' => $ciudadRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="ciudad_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $ciudad = new Ciudad();
        $form = $this->createForm(CiudadType::class, $ciudad);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $name =  $form->get('nombre')->getData();
            $nombre = ucfirst(strtolower($name));
            $ciudad->setNombre($nombre);
            $entityManager = $this->getDoctrine()->getManager();
            try {
                $entityManager->persist($ciudad);
                $entityManager->flush();
            } catch (\Doctrine\DBAL\DBALException $e) {
                $errorMessage = "Ciudad duplicada";
                return $this->render('ciudad/new.html.twig', [
                    'error' => $errorMessage,
                    'form' => $form->createView()
                ]);
            }

            return $this->redirectToRoute('ciudad_index');
        }

        return $this->render('ciudad/new.html.twig', [
            'ciudad' => $ciudad,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="ciudad_show", methods={"GET"})
     */
    public function show(Ciudad $ciudad): Response
    {
        return $this->render('ciudad/show.html.twig', [
            'ciudad' => $ciudad,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="ciudad_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Ciudad $ciudad): Response
    {
        $form = $this->createForm(CiudadType::class, $ciudad);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {


            try {
                $this->getDoctrine()->getManager()->flush();
            } catch (\Doctrine\DBAL\DBALException $e) {
                $errorMessage = "Ciudad duplicada";
                return $this->render('ciudad/edit.html.twig', [
                    'error' => $errorMessage,
                    'ciudad' => $ciudad,
                    'form' => $form->createView()
                ]);
            }
            return $this->redirectToRoute('ciudad_index');
        }

        return $this->render('ciudad/edit.html.twig', [
            'ciudad' => $ciudad,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="ciudad_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Ciudad $ciudad): Response
    {
        if ($this->isCsrfTokenValid('delete' . $ciudad->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($ciudad);
            $entityManager->flush();
        }

        return $this->redirectToRoute('ciudad_index');
    }
}
