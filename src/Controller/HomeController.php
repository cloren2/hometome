<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\RegistrationFormType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\User;
use App\Entity\Foto;
use Symfony\Component\Filesystem\Filesystem;
class HomeController extends AbstractController
{
    /**
     * @Route("/", name="home_index")
     */
    public function index()
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    /**
     * @Route("/home", name="home_user")
     */
    public function home_user()
    {
        return $this->render('home/user.html.twig', [
            'controller_name' => 'HomeUserController',
        ]);
    }

    /**
     * @Route("/home/perfil", name="perfil_user")
     */
    public function perfil_user(Request $request): Response
    {
        $user = $this->getUser();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $fotoFile =  $form->get('foto')->getData();
            if ($fotoFile != null){
                $this->getDoctrine()->getManager()->flush();

                self::renamePic($user,$fotoFile);
            } else {
             $this->getDoctrine()->getManager()->flush();
            }

            return $this->redirectToRoute('perfil_user');
        }

        return $this->render('home/perfil/perfil.html.twig', [
            'user' => $user,
            'registrationForm' => $form->createView(),
        ]);
    }

    private function renamePic(User $user, $fotoFile) {
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        $foto = new Foto();
        $foto->setNombre($fotoFile->getClientOriginalName());
        $entityManager->persist($foto);
        $entityManager->flush();

        $idFoto = $foto->getId();
        $fileName ='img'.$user->getId().'-'.$idFoto.'.'.$fotoFile->guessExtension();

        $filesystem = new Filesystem();
        $filesystem->mkdir('users/user'.$user->getId());

        $fotoFile->move('users/user'.$user->getId(),$fileName);
        $foto->setNombre($fileName);
        $entityManager->flush();

        $user->addFoto($foto);
        $entityManager->flush();
    }

    /**
     * @Route("/{id}", name="perfil_delete", methods={"DELETE"})
     */
    public function delete(Request $request, User $user, TokenStorageInterface $tokenStorage, SessionInterface $session): Response
    {
        if ($this->isCsrfTokenValid('delete' . $user->getId(), $request->request->get('_token'))) {
            
            $tokenStorage->setToken(null);
            $session->invalidate();
            
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($user);
            $entityManager->flush();

            

        }

        return $this->redirectToRoute('home_index');
    }

    /**
     * @Route("/foto/{id}", name="perfilPic_delete", methods={"DELETE"})
     */
    public function deletePicture(Request $request, Foto $foto): Response
    {
        $userId = $_POST['idUsuario'];

        $directorio = 'users/user' . $userId;
        $nombreFoto = $directorio.'/'.$foto->getNombre();
        $filesystem = new Filesystem();

        if ($this->isCsrfTokenValid('delete' . $foto->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($foto);
            $entityManager->flush();
            try {
                $filesystem->remove($nombreFoto);
                if (self::is_dir_empty($directorio)) {
                    rmdir($directorio);
                }
            } catch (IOExceptionInterface $exception) {
                echo "An error occurred while creating your directory at " . $exception->getPath();
            }
        }
        return $this->redirectToRoute('perfil_user');
    }

    function is_dir_empty($dir)
    {
        if (!is_readable($dir)) return NULL;
        $handle = opendir($dir);
        while (false !== ($entry = readdir($handle))) {
            if ($entry != "." && $entry != "..") {
                return FALSE;
            }
        }
        return TRUE;
    }
}
