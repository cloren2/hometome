<?php

namespace App\Controller;

use App\Entity\Foto;
use App\Form\FotoType;
use App\Repository\FotoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/foto")
 */
class FotoController extends AbstractController
{
    /**
     * @Route("/", name="foto_index", methods={"GET"})
     */
    public function index(FotoRepository $fotoRepository): Response
    {
        return $this->render('foto/index.html.twig', [
            'fotos' => $fotoRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="foto_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $foto = new Foto();
        $form = $this->createForm(FotoType::class, $foto);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($foto);
            $entityManager->flush();

            return $this->redirectToRoute('foto_index');
        }

        return $this->render('foto/new.html.twig', [
            'foto' => $foto,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="foto_show", methods={"GET"})
     */
    public function show(Foto $foto): Response
    {
        return $this->render('foto/show.html.twig', [
            'foto' => $foto,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="foto_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Foto $foto): Response
    {
        $form = $this->createForm(FotoType::class, $foto);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('foto_index');
        }

        return $this->render('foto/edit.html.twig', [
            'foto' => $foto,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="foto_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Foto $foto): Response
    {
        if ($this->isCsrfTokenValid('delete'.$foto->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($foto);
            $entityManager->flush();
        }

        return $this->redirectToRoute('foto_index');
    }
}
